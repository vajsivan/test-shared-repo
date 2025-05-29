import { Stack, useTheme } from '@mui/material';

interface PayoffProgressBarProps {
    totalPaidAmount: number;
    totalAmount: number;
    overpaidAmount: number;
}

export const PayoffProgressBar = ({
    totalPaidAmount,
    totalAmount,
    overpaidAmount,
}: PayoffProgressBarProps) => {
    const theme = useTheme();

    const progressPercentage = Math.min(
        (totalPaidAmount / totalAmount) * 100,
        100,
    );

    const overpaidPercentage = (overpaidAmount / totalAmount) * 100;

    return (
        <Stack
            direction="row"
            height={theme.typography.pxToRem(8)}
            gap={0.5}
            width={1}
            alignItems="center"
            borderRadius={theme.typography.pxToRem(8)}
            bgcolor={theme.palette.grey[850]}
        >
            {progressPercentage > 0 && (
                <Stack
                    height={1}
                    width={`${progressPercentage}%`}
                    direction="row"
                    borderRadius={theme.typography.pxToRem(8)}
                    bgcolor="#36D96D"
                />
            )}
            {overpaidPercentage > 0 && (
                <Stack
                    height={1}
                    width={`${Math.abs(overpaidPercentage)}%`}
                    direction="row"
                    borderRadius={theme.typography.pxToRem(8)}
                    bgcolor={theme.palette.error.main}
                />
            )}
        </Stack>
    );
};
