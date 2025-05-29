import { Stack } from '@mui/material';
import { SortDirection } from '@tanstack/react-table';
import { SortAscIcon, SortDescIcon } from 'src/assets';

export const SortIndicator = ({
    direction,
}: {
    direction: SortDirection | false;
}) => (
    <Stack spacing={0.25}>
        {!direction ? (
            <>
                <SortAscIcon />
                <SortDescIcon />
            </>
        ) : (
            {
                asc: <SortAscIcon />,
                desc: <SortDescIcon />,
            }[direction as SortDirection]
        )}
    </Stack>
);
