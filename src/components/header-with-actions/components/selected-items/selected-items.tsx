import { Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import { CloseIcon } from 'src/assets';
import { SelectedItemsProps } from './types';

const SelectedItems = ({
    sx,
    selected,
    children,
    onClear,
    showDivider = true,
}: SelectedItemsProps) => {
    const theme = useTheme();

    return (
        <Stack direction="row" alignItems="center" gap={0.75} sx={sx}>
            <Button
                variant="text"
                endIcon={<CloseIcon />}
                sx={{
                    gap: 1,
                    '&.MuiButtonBase-root': {
                        '& .MuiButton-endIcon': {
                            margin: 0,
                        },
                    },
                }}
                onClick={onClear}
            >
                <Typography
                    variant="body2Regular"
                    color={theme.palette.primary[50]}
                >
                    {selected}
                </Typography>

                <Typography
                    variant="body2Regular"
                    fontWeight={500}
                    color={theme.palette.grey[500]}
                >
                    {children}
                </Typography>
            </Button>

            {showDivider ? (
                <Divider
                    orientation="vertical"
                    sx={{
                        height: 16,
                        width: 2,
                        borderRadius: '1px',
                        backgroundColor: theme.palette.grey[300],
                    }}
                />
            ) : null}
        </Stack>
    );
};

export default SelectedItems;
