import { Stack, Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TextTruncation } from 'src/components/text';
import { InvoicePayment, PaymentDetailsEntry } from 'src/types';

export const useExtendedPaymentsTableColumns = (
    handlePreviewDetails: (details: PaymentDetailsEntry) => void,
) => {
    const { t } = useTranslation();
    const columnHelper = createColumnHelper<InvoicePayment>();

    return useMemo(
        () => [
            columnHelper.accessor('title', {
                maxSize: 440,
                header: () => (
                    <Typography
                        maxWidth={426}
                        fontWeight={500}
                        variant="body3Regular"
                        lineHeight={(theme) => theme.typography.pxToRem(14)}
                    >
                        {t('crm.labels.payments')}
                    </Typography>
                ),
                cell: ({ row }) => (
                    <TextTruncation tooltip={row.original.title}>
                        <Typography
                            fontWeight={500}
                            variant="body1Regular"
                            lineHeight={1}
                            color={(theme) => theme.palette.primary.main}
                            sx={{ cursor: 'pointer' }}
                            onClick={() =>
                                handlePreviewDetails({
                                    resourceId: row.original.id,
                                    bankTransactionId:
                                        row.original.bankTransactionId,
                                })
                            }
                        >
                            {row.original.title}
                        </Typography>
                    </TextTruncation>
                ),
            }),
            columnHelper.accessor('paymentDate', {
                maxSize: 240,
                header: () => (
                    <Typography
                        maxWidth={226}
                        fontWeight={500}
                        variant="body3Regular"
                        lineHeight={(theme) => theme.typography.pxToRem(14)}
                    >
                        {t('crm.labels.date')}
                    </Typography>
                ),
                cell: ({ row }) => (
                    <TextTruncation tooltip={row.original.paymentDate}>
                        <Typography variant="body1Regular" lineHeight={1}>
                            {row.original.paymentDate?.toNexDateFormatted()}
                        </Typography>
                    </TextTruncation>
                ),
            }),
            columnHelper.accessor('amount', {
                size: 200,
                header: () => (
                    <Typography
                        width={200}
                        fontWeight={500}
                        variant="body3Regular"
                        lineHeight={1}
                        textAlign="right"
                    >
                        {t('labels.amount')}
                    </Typography>
                ),
                cell: ({ row }) => (
                    <Stack justifyContent="flex-end">
                        <Typography
                            variant="body1Regular"
                            lineHeight={1}
                            textAlign="right"
                        >
                            {row.original.amount.toNexCurrencyFormatted(
                                row.original.currency,
                            )}
                        </Typography>
                    </Stack>
                ),
            }),
            columnHelper.display({
                id: 'fake-cell-for-expanding-entire-row',
                header: () => <Stack width={1} />,
                cell: () => <Stack width={1} />,
            }),
        ],
        [columnHelper, handlePreviewDetails, t],
    );
};
