import { Stack, Typography, useTheme } from '@mui/material';
import { CheckmarkIcon } from 'src/assets';

export const InputSuccessMessage = ({
    message,
    messageColor,
}: {
    message?: string;
    messageColor?: string;
}) => {
    const theme = useTheme();

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="start"
            gap={1}
        >
            <CheckmarkIcon color={messageColor ?? theme.palette.success[70]} />
            <Typography
                variant="body2"
                color={messageColor ?? theme.palette.success[70]}
            >
                {message}
            </Typography>
        </Stack>
    );
};
