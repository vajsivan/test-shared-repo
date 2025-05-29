import { Row } from '@tanstack/react-table';
import { useMemo } from 'react';
import { NexDataLoader } from 'src/components/loading-indicators';
import {
    NexPageableVirtualTable,
    NexPageableVirtualTableProps,
} from '../../nex-pageable-virtual-table';

interface ExpendedTableRowProps<
    TRowData extends { id: string | number },
    TTableData,
> extends NexPageableVirtualTableProps<TTableData> {
    row: Row<TRowData>;
    isLoading: boolean;
}

export const ExpendedTableRow = <
    TRowData extends { id: string | number },
    TTableData,
>({
    row,
    isLoading,
    ...tableProps
}: ExpendedTableRowProps<TRowData, TTableData>) => {
    const tdStyledMemoized = useMemo(
        () => ({
            padding: 0,
        }),
        [],
    );
    // TODO: commented code should be checked if we want sticky columns in the future for expanded table
    return (
        <tr>
            <td
                // colSpan={row.getVisibleCells().length - 1}
                colSpan={row.getVisibleCells().length}
                style={tdStyledMemoized}
            >
                {isLoading ? (
                    <NexDataLoader />
                ) : (
                    <NexPageableVirtualTable {...tableProps} />
                )}
            </td>

            {/* <td
        style={{
            padding: 0,
            backgroundColor: theme.palette.grey[100],
            borderRadius: theme.shape.borderRadius('sm'),
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            boxShadow: `10px 3px 10px -10px rgba(92,95,112,0.03),
                        20px 3px 40px -10px rgba(92,95,112,0.06),
                        30px 3px 50px -10px rgba(92,95,112,0.1)`,

            right: '1px',
            opacity: 0.95,
            position: 'sticky',
            zIndex: 10,
        }}
    /> */}
        </tr>
    );
};
