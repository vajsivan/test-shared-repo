import { styled, TableCell } from '@mui/material';

export const NexTableFooterCellStyled = styled(TableCell)(({ theme }) => ({
    alignItems: 'left',
    textAlign: 'left',
    border: 0,
    fontSize: theme.typography.pxToRem(16),
    lineHeight: 1,
    padding: `${theme.spacing(1.5)} ${theme.spacing(1)}`,
    fontWeight: 600,
}));
