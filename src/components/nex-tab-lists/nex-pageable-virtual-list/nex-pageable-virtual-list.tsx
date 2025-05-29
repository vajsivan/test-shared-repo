import {
    List,
    ListItem,
    SxProps,
    Theme,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NexDataLoader } from 'src/components/loading-indicators';
import { useOnScreen } from 'src/hooks/use-on-screen';

interface NexPageableVirtualListProps<T> {
    isLoading?: boolean;
    items: T[];
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage?: () => void;
    renderListItem: (item: T, index: number) => React.ReactNode;
    onListItemClick?: (obj: {
        e: React.MouseEvent<HTMLLIElement>;
        item: T;
    }) => void;
    sx?: SxProps<Theme>;
    sxListItem?: SxProps<Theme>;
    noDataSection?: React.ReactNode | null;
}

export const NexPageableVirtualList = <T,>({
    isLoading,
    items,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    renderListItem,
    onListItemClick,
    sx,
    sxListItem,
    noDataSection,
}: NexPageableVirtualListProps<T>) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { observerRef, isIntersecting, observer } = useOnScreen();

    useEffect(() => {
        if (isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage?.();
            observer?.disconnect();
        }
    }, [
        isIntersecting,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        observer,
    ]);

    const renderNoDataSection = (): React.ReactNode | null => {
        if (noDataSection === null) {
            return null;
        }

        if (!noDataSection) {
            return (
                <Typography
                    sx={{
                        textAlign: 'center',
                        padding: 1,
                        color: 'text.secondary',
                    }}
                >
                    {t('general.no_results_found')}
                </Typography>
            );
        }

        return noDataSection;
    };

    return (
        <List
            tabIndex={-1}
            sx={{
                maxHeight: 330,
                overflowY: 'auto',
                overflowX: 'hidden',
                ...sx,
            }}
        >
            {isLoading ? (
                <NexDataLoader />
            ) : (
                items.length === 0 && renderNoDataSection()
            )}

            {items.length > 0 &&
                items.map((item, index) => (
                    <ListItem
                        tabIndex={0}
                        key={`list-item${index}`}
                        sx={{
                            p: 0,
                            '&:focus-visible': {
                                borderRadius: theme.shape.borderRadius('xs'),
                                border: `1px solid ${theme.palette.primary.main}`,
                                outline: 'none',
                            },
                            ...sxListItem,
                        }}
                        ref={index === items.length - 1 ? observerRef : null}
                        onClick={(e) => onListItemClick?.({ e, item })}
                    >
                        {renderListItem(item, index)}
                    </ListItem>
                ))}

            {isFetchingNextPage && <NexDataLoader />}
        </List>
    );
};
