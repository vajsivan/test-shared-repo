import { flexRender, Row } from '@tanstack/react-table';
import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import {
    NexTableCellStyled,
    NexTableRow,
} from 'src/components/nex-table/styled';
import { NexTableComponents } from '../../../types';
import { getCommonPinningStyles } from '../../../utils';

interface NexPageableVirtualTableRowProps<TData> {
    row: Row<TData>;
    components?: NexTableComponents;
}

export const NexPageableVirtualTableRow = <TData,>({
    row,
    components,
}: NexPageableVirtualTableRowProps<TData>) => {
    const theme = useTheme();

    const NexTableRowLocal = useMemo(
        () => components?.TableRow ?? NexTableRow,
        [components?.TableRow],
    );

    const NexTableCell = useMemo(
        () => components?.TableCell ?? NexTableCellStyled,
        [components?.TableCell],
    );

    return (
        <NexTableRowLocal
            selected={row.getCanSelect() && row.getIsSelected()}
            isSelectable={row.getCanSelect()}
            onClick={row.getToggleSelectedHandler()}
            data-testid={`table-body-row-${row.index}`}
        >
            {row.getVisibleCells().map((cell) => (
                <NexTableCell
                    data-testid={`cell-${cell.column.id}-row-${cell.row.index}-column-${cell.column.getIndex()}`}
                    key={cell.id}
                    sx={{
                        cursor: row.getCanSelect() ? 'pointer' : 'default',
                        width:
                            cell.column.getSize() === Number.MAX_SAFE_INTEGER
                                ? 'auto'
                                : cell.column.getSize(),
                    }}
                    style={getCommonPinningStyles(theme, cell.column)}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </NexTableCell>
            ))}
        </NexTableRowLocal>
    );
};
