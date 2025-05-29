import { TableFooter, styled } from '@mui/material';

export const NexTableFooterStyled = styled(TableFooter)(({ theme }) => ({
    position: 'sticky',
    backgroundColor: theme.palette.common.white,
    bottom: 0,
    zIndex: 1,
}));
