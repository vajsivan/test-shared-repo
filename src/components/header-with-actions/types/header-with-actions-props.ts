import { Theme, SxProps } from '@mui/material';
import { ReactNode } from 'react';

export interface HeaderWithActionsProps {
    sx?: SxProps<Theme>;
    leftContentSx?: SxProps<Theme>;
    rightContentSx?: SxProps<Theme>;
    leftContent?: ReactNode;
    rightContent?: ReactNode;
}
