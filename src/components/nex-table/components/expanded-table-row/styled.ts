import { TableRow, TableCell, styled, Table } from '@mui/material';

export const ExpandedTableStyled = styled(Table)(({ theme }) => ({
    width: '100%',
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius('sm'),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
}));

export const ExpandedTableRowStyled = styled(TableRow, {
    shouldForwardProp: (prop) => prop !== 'isSelectable',
})<{ isSelectable: boolean }>(({ theme }) => ({
    backgroundColor: 'transparent',
    'td:first-of-type': {
        paddingLeft: theme.spacing(8),
    },
    'td:last-of-type': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
}));

export const ExpandedTableHeadRowStyled = styled(TableRow)(({ theme }) => ({
    backgroundColor: 'transparent',
    'th:first-of-type': {
        paddingLeft: theme.spacing(8),
    },
}));

export const ExpandedTableHeaderCellStyled = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1),
    color: theme.palette.grey[750],
    fontWeight: 500,
    lineHeight: 1.2,
    letterSpacing: '0.02em',
    backgroundColor: 'transparent',
}));
