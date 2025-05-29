import { TableHead } from '@mui/material';
import {
    ExpandedTableHeaderCellStyled,
    ExpandedTableHeadRowStyled,
    ExpandedTableRowStyled,
    ExpandedTableStyled,
    NexTableCellStyled,
} from 'src/components/nex-table';

export const EXPANDED_PAYMENTS_TABLE_COMPONENTS = {
    Table: ExpandedTableStyled,
    TableHead,
    TableHeadRow: ExpandedTableHeadRowStyled,
    TableRow: ExpandedTableRowStyled,
    TableCell: NexTableCellStyled,
    TableHeadCell: ExpandedTableHeaderCellStyled,
};
