import {
    Box,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { TrashBinIcon } from 'src/assets';
import { useCallback } from 'react';

export type NexTabListItemProps<T> = {
    item: T;
    selectedItemId: number | string;
    itemLengthForTooltip?: number;
    onDeleteItem?: (item: T) => void;
};

export const NexTabListItem = <
    T extends { id: number | string; name: string },
>({
    item,
    selectedItemId,
    itemLengthForTooltip = 30,
    onDeleteItem,
}: NexTabListItemProps<T>) => {
    const theme = useTheme();

    const { id, name } = item;
    const parsedId = id.toString();
    const parsedSelectedId = selectedItemId.toString();

    const isSelected = parsedSelectedId === parsedId;

    const callbackRef = useCallback(
        (node: HTMLDivElement) => {
            if (isSelected) {
                node?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest',
                });
            }
        },
        [isSelected],
    );

    return (
        <Stack
            sx={{
                justifyContent: 'space-between',
                width: 1,
                p: 2,
                mb: 1,
                cursor: 'pointer',
                backgroundColor: isSelected
                    ? theme.palette.primary[20]
                    : 'transparent',
                color: isSelected ? theme.palette.primary.main : 'inherit',
                borderRadius: theme.shape.borderRadius('sm'),
                '&:hover': {
                    backgroundColor: theme.palette.grey[100],
                    color: () => 'inherit',
                    '.trash-bin-icon': {
                        visibility: onDeleteItem ? 'visible' : 'hidden',
                    },
                },
            }}
            key={parsedId}
            ref={callbackRef}
        >
            <Tooltip
                title={
                    name?.length > itemLengthForTooltip ? (
                        <Typography component="span">{name}</Typography>
                    ) : null
                }
                arrow
                placement="right"
            >
                <Box width="inherit">
                    <Box display="flex" alignItems="space-between" width="100%">
                        <Box
                            display="flex"
                            flex={7}
                            alignItems="center"
                            sx={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <Typography
                                variant="body1Regular"
                                sx={{
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {name}
                            </Typography>
                        </Box>

                        {onDeleteItem && (
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteItem?.(item);
                                }}
                                className="trash-bin-icon"
                                sx={{
                                    alignSelf: 'flex-end',
                                    visibility: 'hidden',
                                }}
                            >
                                <TrashBinIcon />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            </Tooltip>
        </Stack>
    );
};
