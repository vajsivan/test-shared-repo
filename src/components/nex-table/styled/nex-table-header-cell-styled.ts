import { styled, TableCell } from '@mui/material';

export const NexTableHeaderCellStyled = styled(TableCell)(({ theme }) => ({
    border: 0,
    padding: `${theme.spacing(1.5)} ${theme.spacing(1)}`,
}));
