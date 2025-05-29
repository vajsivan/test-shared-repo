import { Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PayoffProgressHeaderProps {
    totalAmount: number;
    currency: string;
    totalPaidAmount: number;
}

export const PayoffProgressHeader = ({
    currency,
    totalPaidAmount,
    totalAmount,
}: PayoffProgressHeaderProps) => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Stack direction="row" gap={1} flex={1} alignItems="center">
            <Typography
                variant="body2Regular"
                lineHeight={1.2}
                fontWeight={500}
                color={theme.palette.grey[500]}
            >
                {t('crm.enums.PAID')}
            </Typography>

            <Stack direction="row" gap={1} justifyContent="center" flex={1}>
                <Typography
                    variant="body2Regular"
                    lineHeight={1.2}
                    fontWeight={600}
                    color={theme.palette.grey[850]}
                >
                    {totalPaidAmount.toNexCurrencyFormatted(currency)}
                </Typography>

                <Typography
                    variant="body2Regular"
                    lineHeight={1.2}
                    fontWeight={500}
                    color={theme.palette.grey[500]}
                >
                    {t('common.from').toLowerCase()}
                </Typography>

                <Typography
                    variant="body2Regular"
                    lineHeight={1.2}
                    fontWeight={500}
                    color={theme.palette.grey[850]}
                >
                    {totalAmount.toNexCurrencyFormatted(currency)}
                </Typography>
            </Stack>
        </Stack>
    );
};
