import { Stack } from '@mui/material';
import { useGetMatchedPurchases } from 'src/services';
import { BankTransaction } from 'src/types';
import { NexDataLoader } from 'src/components/loading-indicators';
import { useTranslation } from 'react-i18next';
import { MatchedPaymentRow } from './matched-payment-row';

interface Props {
    transaction: BankTransaction;
}

export const MatchedPurchaseItems = ({ transaction }: Props) => {
    const { t } = useTranslation();
    const { data: purchases = [], isLoading } = useGetMatchedPurchases(
        transaction.id,
    );

    return (
        <Stack spacing={1}>
            {isLoading && <NexDataLoader />}
            {purchases?.map((purchase, index) => (
                <MatchedPaymentRow
                    key={index}
                    row={purchase}
                    currency={transaction.currency}
                />
            ))}
            {purchases?.length === 0 && !isLoading && (
                <Stack px={2} color={(theme) => theme.palette.grey[500]}>
                    {t('banking.payments.no_matched_payments')}
                </Stack>
            )}
        </Stack>
    );
};
