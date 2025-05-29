import {
    HeaderGroup,
    RowModel,
    Table as ReactTable,
    Row,
} from '@tanstack/react-table';
import {
    TableProps,
    TableHeadProps,
    TableRowProps,
    TableCellProps,
    TableBodyProps,
    TableFooterProps,
    SxProps,
    Theme,
} from '@mui/material';

export type NexTableComponents = {
    Table?: React.ComponentType<TableProps>;
    TableHead?: React.ComponentType<TableHeadProps>;
    TableHeadRow?: React.ComponentType<TableRowProps>;
    TableHeadCell?: React.ComponentType<TableCellProps>;
    TableBody?: React.ComponentType<TableBodyProps>;
    TableRow?: React.ComponentType<TableRowProps & { isSelectable: boolean }>;
    TableCell?: React.ComponentType<TableCellProps>;
    TableFooter?: React.ComponentType<TableFooterProps>;
    TableFooterCell?: React.ComponentType<TableCellProps>;
};

export interface NexPageableVirtualTableProps<TData> {
    table: ReactTable<TData>;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage?: () => void;
    renderBody?: (row: RowModel<TData>) => React.ReactNode;
    renderHeader?: (headerGroups: HeaderGroup<TData>[]) => React.ReactNode;
    renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
    components?: NexTableComponents;
    sx?: SxProps<Theme>;
}
