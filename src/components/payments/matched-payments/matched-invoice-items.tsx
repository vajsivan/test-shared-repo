import { Stack } from '@mui/material';
import { useGetMatchedInvoices } from 'src/services';
import { BankTransaction } from 'src/types';
import { NexDataLoader } from 'src/components/loading-indicators';
import { useTranslation } from 'react-i18next';
import { MatchedPaymentRow } from './matched-payment-row';

interface Props {
    transaction: BankTransaction;
}

export const MatchedInvoiceItems = ({ transaction }: Props) => {
    const { t } = useTranslation();
    const { data: invoices = [], isLoading } = useGetMatchedInvoices(
        transaction.id,
    );

    return (
        <Stack spacing={1}>
            {isLoading && <NexDataLoader />}
            {invoices?.map((invoice, index) => (
                <MatchedPaymentRow
                    key={index}
                    row={invoice}
                    currency={transaction.currency}
                />
            ))}
            {invoices?.length === 0 && !isLoading && (
                <Stack px={2} color={(theme) => theme.palette.grey[500]}>
                    {t('banking.payments.no_matched_payments')}
                </Stack>
            )}
        </Stack>
    );
};
