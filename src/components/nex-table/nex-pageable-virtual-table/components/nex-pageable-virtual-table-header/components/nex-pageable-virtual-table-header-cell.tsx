import { Stack, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { flexRender, Header } from '@tanstack/react-table';
import { NexTableHeaderCellStyled } from 'src/components/nex-table/styled';
import { NexTableComponents } from '../../../types';
import { getCommonPinningStyles } from '../../../utils';
import { SortIndicator } from './sort-indicator';

interface NexPageableVirtualTableHeaderCellProps<TData> {
    header?: Header<TData, unknown>;
    components?: NexTableComponents;
}

export const NexPageableVirtualTableHeaderCell = <TData,>({
    header,
    components,
}: NexPageableVirtualTableHeaderCellProps<TData>) => {
    const theme = useTheme();

    const NexTableHeadCell = useMemo(
        () => components?.TableHeadCell ?? NexTableHeaderCellStyled,
        [components?.TableHeadCell],
    );

    if (!header) return null;

    return (
        <NexTableHeadCell
            key={header.id}
            sx={{
                cursor: header.column.getCanSort() ? 'pointer' : 'default',
                width:
                    header.getSize() === Number.MAX_SAFE_INTEGER
                        ? 'auto'
                        : header.getSize(),
            }}
            style={getCommonPinningStyles(theme, header.column, {
                isHeaderCell: true,
            })}
            colSpan={header.colSpan}
            onClick={header.column.getToggleSortingHandler()}
        >
            <Stack direction="row" alignItems="center" spacing={0.5}>
                {header.isPlaceholder
                    ? null
                    : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                      )}

                {header.column.getCanSort() && (
                    <SortIndicator direction={header.column.getIsSorted()} />
                )}
            </Stack>
        </NexTableHeadCell>
    );
};
