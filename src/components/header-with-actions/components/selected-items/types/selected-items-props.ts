import { PropsWithChildren } from 'react';
import { Theme, SxProps } from '@mui/material';

export interface SelectedItemsProps extends PropsWithChildren {
    sx?: SxProps<Theme>;
    selected: number;
    onClear: () => void;
    showDivider?: boolean;
}
