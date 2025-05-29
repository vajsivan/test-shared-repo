import { Stack, Typography, useTheme } from '@mui/material';
import { WarningIconFilled } from 'src/assets';

export const InputErrorMessage = ({
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
            <WarningIconFilled
                color={messageColor ?? theme.palette.error[50]}
            />
            <Typography
                variant="body2"
                color={messageColor ?? theme.palette.error[50]}
            >
                {message}
            </Typography>
        </Stack>
    );
};
