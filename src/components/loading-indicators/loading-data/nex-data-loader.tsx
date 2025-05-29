import { LinearProgress, Stack, SxProps, Theme } from '@mui/material';

interface NexDataLoaderProps {
    sx?: SxProps<Theme>;
    dataTestId?: string;
}

export const NexDataLoader = ({
    sx,
    dataTestId = 'loader',
}: NexDataLoaderProps) => (
    <Stack sx={{ width: '100%', ...sx }} data-testid={dataTestId}>
        <LinearProgress />
    </Stack>
);
