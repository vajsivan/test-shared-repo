import {
    Box,
    IconButton,
    Stack,
    SxProps,
    Theme,
    useTheme,
} from '@mui/material';
import { ReactNode, useCallback } from 'react';
import { FieldErrors, FieldValues, Path } from 'react-hook-form';
import { ChevronIcon, CloseIcon } from 'src/assets';
import { InputErrorMessage } from 'src/components/inputs/input-error-message';
import { UsePopover } from 'src/components/nex-popover';

interface NexGenericSelectButtonProps<TField extends FieldValues> {
    sx?: SxProps<Theme>;
    popover: UsePopover;
    sxButton?: SxProps<Theme>;
    disabled?: boolean;
    hasChevronIcon?: boolean;
    children: ReactNode;
    error?: FieldErrors<TField>[Path<TField>] | string;
    helperText?: ReactNode;
    setButtonWidth: (width: number) => void;
    setIsFocused?: (isFocused: boolean) => void;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onClear?: () => void;
    hasClearButton?: boolean;
}

export function NexGenericSelectButton<TField extends FieldValues>({
    sx,
    popover,
    sxButton,
    disabled,
    hasChevronIcon = true,
    children,
    error,
    helperText,
    setButtonWidth,
    setIsFocused,
    onClick,
    onClear,
    hasClearButton = true,
}: NexGenericSelectButtonProps<TField>) {
    const theme = useTheme();

    const callbackRef = useCallback(
        (node: HTMLButtonElement | null) => {
            setButtonWidth(node?.offsetWidth || 0);

            const resizeObserver = new ResizeObserver(() => {
                setButtonWidth(node?.offsetWidth || 0);
            });

            if (node) {
                resizeObserver.observe(node);
            } else {
                resizeObserver.disconnect();
            }
        },
        [setButtonWidth],
    );

    const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        popover.onOpen(event);

        onClick?.(event);
    };

    const clearHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        onClear?.();
    };

    const sxButtonProps = { ...sxButton } as const;

    const activeStyle = {
        border: '1px solid transparent',
        boxShadow: `inset 0 0 0px 2px ${
            error ? theme.palette.error.main : theme.palette.primary[30]
        }`,
    };

    const getBorderColor = (): string => {
        if (disabled) return theme.palette.grey[300];
        if (error) return theme.palette.error.main;
        return theme.palette.grey[500];
    };

    return (
        <Stack width={1} gap={0.5} sx={sx}>
            <Box
                tabIndex={0}
                ref={callbackRef}
                component="div"
                sx={{
                    border: `1px solid ${
                        error
                            ? theme.palette.error.main
                            : theme.palette.grey[300]
                    }`,
                    background: disabled ? theme.palette.grey[200] : 'unset',
                    ':hover': {
                        borderColor: getBorderColor(),
                    },
                    ':focus': {
                        ...activeStyle,
                    },
                    ':active': {
                        ...activeStyle,
                    },
                    ...(popover.open && {
                        ...activeStyle,
                    }),
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    width: 1,
                    padding: 0,
                    borderRadius: theme.shape.borderRadius('sm'),
                    cursor: disabled ? 'default' : 'pointer',

                    ...sxButtonProps,
                }}
                onFocus={() => setIsFocused?.(true)}
                onBlur={() => setIsFocused?.(false)}
                onClick={disabled ? undefined : clickHandler}
            >
                {children}

                {hasClearButton && onClear && (
                    <IconButton onClick={clearHandler}>
                        <CloseIcon />
                    </IconButton>
                )}

                {hasChevronIcon && (
                    <ChevronIcon
                        disabled={disabled}
                        sx={{
                            ...(popover.open
                                ? { transform: 'rotate(90deg)' }
                                : {
                                      transform: 'rotate(-90deg)',
                                  }),
                            marginLeft: 1,
                            color: theme.palette.grey[500],
                            marginRight: 1.2,
                            width: 13,
                            height: 13,
                            justifySelf: 'flex-end',
                            flexShrink: 0,
                        }}
                    />
                )}
            </Box>

            {error ? (
                <InputErrorMessage
                    message={
                        typeof error === 'string'
                            ? error
                            : (error.message as string)
                    }
                />
            ) : (
                helperText
            )}
        </Stack>
    );
}
