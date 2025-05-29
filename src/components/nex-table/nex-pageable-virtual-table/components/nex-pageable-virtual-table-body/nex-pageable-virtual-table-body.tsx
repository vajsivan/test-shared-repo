import { Row, Table as ReactTable } from '@tanstack/react-table';
import { TableBody } from '@mui/material';
import { Fragment, MutableRefObject, useMemo } from 'react';
import { NexTableComponents } from '../../types';
import { NexPageableVirtualTableRow } from './components';

interface NexPageableVirtualTableBodyProps<TData> {
    table: ReactTable<TData>;
    components?: NexTableComponents;
    renderExpendedRowRef: MutableRefObject<
        ((row: Row<TData>) => React.ReactNode) | undefined
    >;
    endOfTableRef: (node?: Element | null) => void;
}

export const NexPageableVirtualTableBody = <TData,>({
    table,
    components,
    renderExpendedRowRef,
    endOfTableRef,
}: NexPageableVirtualTableBodyProps<TData>) => {
    const NexTableBody = useMemo(
        () => components?.TableBody ?? TableBody,
        [components?.TableBody],
    );

    return (
        <NexTableBody>
            {table.getRowModel().rows.map((row, index) => (
                <Fragment key={`${row.id}_${index}`}>
                    <NexPageableVirtualTableRow
                        row={row}
                        components={components}
                    />

                    {row.getIsExpanded() && renderExpendedRowRef.current?.(row)}
                </Fragment>
            ))}

            <tr>
                <td
                    ref={endOfTableRef}
                    colSpan={table.getFlatHeaders().length}
                />
            </tr>
        </NexTableBody>
    );
};
