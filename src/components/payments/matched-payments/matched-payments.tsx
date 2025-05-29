import { Stack, Typography } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { BankTransaction, TransactionTypeEnum } from 'src/types';
import { MatchedPurchaseItems } from './matched-purchase-items';
import { MatchedInvoiceItems } from './matched-invoice-items';

interface Props {
    transaction: BankTransaction;
}

export const MatchedPayments = ({ transaction }: Props) => {
    const { t } = useTranslation();

    const isPurchase =
        transaction.transactionType === TransactionTypeEnum.DEBIT;

    return (
        <Stack spacing={2} py={2}>
            <Typography
                variant="body1Bold"
                color={(theme) => theme.palette.grey[850]}
                my={0}
            >
                {t('banking.payments.matched_payments')}
            </Typography>

            {isPurchase ? (
                <MatchedPurchaseItems transaction={transaction} />
            ) : (
                <MatchedInvoiceItems transaction={transaction} />
            )}
        </Stack>
    );
};
