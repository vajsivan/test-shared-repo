import { useMemo } from 'react';
import { TableRow, useTheme } from '@mui/material';
import { flexRender, Table } from '@tanstack/react-table';
import { NexTableComponents } from '../types';
import { getCommonPinningStyles } from '../utils';
import { NexTableFooterStyled } from '../../styled/nex-table-footer-styled';
import { NexTableFooterCellStyled } from '../../styled';

interface NexPageableVirtualTableFooterProps<TData> {
    table: Table<TData>;
    components?: NexTableComponents;
}

export const NexPageableVirtualTableFooter = <TData,>({
    table,
    components,
}: NexPageableVirtualTableFooterProps<TData>) => {
    const theme = useTheme();

    const NexTableFooter = useMemo(
        () => components?.TableFooter ?? NexTableFooterStyled,
        [components?.TableFooter],
    );

    const NexTableFooterCell = useMemo(
        () => components?.TableFooterCell ?? NexTableFooterCellStyled,
        [components?.TableFooterCell],
    );

    const hasFooter = useMemo(
        () => table.getAllColumns().some((column) => column.columnDef.footer),
        [table],
    );
    return (
        hasFooter &&
        table.getRowModel().rows.length > 0 && (
            <NexTableFooter>
                {table.getFooterGroups().map((footerGroup) => (
                    <TableRow key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                            <NexTableFooterCell
                                key={header.id}
                                sx={{
                                    width:
                                        header.getSize() ===
                                        Number.MAX_SAFE_INTEGER
                                            ? 'auto'
                                            : header.getSize(),
                                }}
                                style={getCommonPinningStyles(
                                    theme,
                                    header.column,
                                )}
                                colSpan={header.colSpan}
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.footer,
                                          header.getContext(),
                                      )}
                            </NexTableFooterCell>
                        ))}
                    </TableRow>
                ))}
            </NexTableFooter>
        )
    );
};
