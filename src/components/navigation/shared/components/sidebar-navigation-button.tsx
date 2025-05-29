import { MouseEvent, ReactNode } from 'react';
import {
    Button,
    Stack,
    Tooltip,
    Typography,
    alpha,
    useTheme,
    SxProps,
    Theme,
} from '@mui/material';

interface SidebarNavigationButtonProps {
    children?: ReactNode;
    description?: ReactNode;
    onClick: (event?: MouseEvent<HTMLButtonElement>) => void;
    icon?: ReactNode;
    isMiniNav?: boolean;
    tooltipTitle?: ReactNode;
}

const SidebarNavigationButtonContent = ({
    children,
    description,
    sx,
    descriptionSx,
    childrenSx,
}: {
    children: ReactNode;
    description: ReactNode;
    sx?: SxProps<Theme>;
    descriptionSx?: SxProps<Theme>;
    childrenSx?: SxProps<Theme>;
}) => {
    const theme = useTheme();

    return (
        <Stack gap={1} sx={sx}>
            <Stack
                direction="row"
                gap={0.5}
                alignItems="center"
                lineHeight={1}
                sx={childrenSx}
            >
                {children}
            </Stack>

            {description && (
                <Typography
                    fontSize={12}
                    color={theme.palette.grey[700]}
                    variant="caption"
                    sx={descriptionSx}
                >
                    {description}
                </Typography>
            )}
        </Stack>
    );
};

const SidebarNavigationButton = ({
    children,
    description,
    onClick,
    isMiniNav,
    icon,
    tooltipTitle,
}: SidebarNavigationButtonProps) => {
    const theme = useTheme();

    const buttonStyles = {
        borderRadius: theme.shape.borderRadius('sm'),
        color: theme.palette.grey[900],
        fontWeight: '400',
        '&:hover': {
            color: 'currentColor',
            backgroundColor: alpha(theme.palette.grey[500], 0.08),
        },
    };

    const miniNavStyles = {
        minWidth: '100%',
        '& span': {
            mr: 0,
            ml: 0,
        },
    };

    const regularStyles = {
        p: theme.spacing(1.75),
        width: '100%',
        justifyContent: 'flex-start',
        fontSize: 'body2Regular',
        '& span': {
            mr: '6px',
            ml: 0,
        },
    };

    return (
        <Tooltip
            title={
                (isMiniNav && tooltipTitle) || (
                    <SidebarNavigationButtonContent
                        description={description}
                        descriptionSx={{
                            color: theme.palette.common.white,
                        }}
                    >
                        {children}
                    </SidebarNavigationButtonContent>
                )
            }
            arrow
            placement="right"
        >
            <Button
                startIcon={icon}
                variant="text"
                sx={{
                    ...buttonStyles,
                    ...(isMiniNav ? miniNavStyles : regularStyles),
                }}
                disableRipple
                onClick={onClick}
            >
                {!isMiniNav && (
                    <SidebarNavigationButtonContent description={description}>
                        {children}
                    </SidebarNavigationButtonContent>
                )}
            </Button>
        </Tooltip>
    );
};

export default SidebarNavigationButton;
