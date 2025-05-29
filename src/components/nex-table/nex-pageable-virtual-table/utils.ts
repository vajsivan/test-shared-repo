import { Theme } from '@mui/material';
import { Column } from '@tanstack/react-table';
import { CSSProperties } from 'react';

export const getCommonPinningStyles = <TData>(
    theme: Theme,
    column: Column<TData>,
    options = { isHeaderCell: false },
): CSSProperties => {
    const isPinned = column.getIsPinned();

    const getBackgroundColor = () => {
        if (!isPinned) return undefined;

        if (options.isHeaderCell) {
            return theme.palette.grey[50];
        }

        return theme.palette.common.white;
    };

    const isLastLeftPinnedColumn =
        isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn =
        isPinned === 'right' && column.getIsFirstColumn('right');

    const getBoxShadow = () => {
        if (isLastLeftPinnedColumn) {
            return `10px 3px 10px -10px rgba(92,95,112,0.03),
                    20px 3px 40px -10px rgba(92,95,112,0.06),
                    30px 3px 50px -10px rgba(92,95,112,0.1)`;
        }

        if (isFirstRightPinnedColumn) {
            return `-10px 3px 10px -10px rgba(92,95,112,0.03),
                    -20px 3px 40px -10px rgba(92,95,112,0.06),
                    -30px 3px 50px -10px rgba(92,95,112,0.1)`;
        }

        return undefined;
    };

    return {
        boxShadow: getBoxShadow(),
        backgroundColor: getBackgroundColor(),
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right:
            isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        opacity: isPinned ? 0.95 : 1,
        position: isPinned ? 'sticky' : 'relative',
        zIndex: isPinned ? 1 : 0,
    };
};
