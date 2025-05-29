import { useMemo } from 'react';
import { Table as ReactTable } from '@tanstack/react-table';
import {
    NexTableHeadStyled,
    NexTableRowStyled,
} from 'src/components/nex-table/styled';
import { NexDataLoader } from 'src/components/loading-indicators/loading-data/nex-data-loader';
import { NexTableComponents } from '../../types';
import { NexPageableVirtualTableHeaderCell } from './components/nex-pageable-virtual-table-header-cell';

interface NexPageableVirtualTableHeaderProps<TData> {
    table: ReactTable<TData>;
    components?: NexTableComponents;
    isFetchingNextPage?: boolean;
}

export const NexPageableVirtualTableHeader = <TData,>({
    table,
    components,
    isFetchingNextPage,
}: NexPageableVirtualTableHeaderProps<TData>) => {
    const NexTableHead = useMemo(
        () => components?.TableHead ?? NexTableHeadStyled,
        [components?.TableHead],
    );
    const NexTableHeadRow = useMemo(
        () => components?.TableHeadRow ?? NexTableRowStyled,
        [components?.TableHeadRow],
    );

    return (
        <NexTableHead>
            {table.getHeaderGroups().map((headerGroup) => (
                <NexTableHeadRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <NexPageableVirtualTableHeaderCell
                            key={header.id}
                            header={header}
                            components={components}
                        />
                    ))}
                </NexTableHeadRow>
            ))}

            {isFetchingNextPage && (
                <tr>
                    <td colSpan={table.getFlatHeaders().length}>
                        <NexDataLoader />
                    </td>
                </tr>
            )}
        </NexTableHead>
    );
};
