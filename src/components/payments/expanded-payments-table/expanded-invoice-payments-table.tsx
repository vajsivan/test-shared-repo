import { Row } from '@tanstack/react-table';
import { ExpendedTableRow } from 'src/components/nex-table';
import { memo, useState } from 'react';
import {
    useGetReceivableDetails,
    useInvoicePaymentsService,
} from 'src/services/api/shared/payment-queries';
import { PaymentDetailsEntry } from 'src/types/payments/invoice-payment';
import { useExtendedPaymentsTableColumns, useExtendedRowTable } from './hooks';
import { EXPANDED_PAYMENTS_TABLE_COMPONENTS } from './constants';
import { ManualPaymentDetailsPreview } from '../manual-payment-details-preview/manual-payment-details-preview';
import { BankPaymentDetailsPreview } from '../bank-payment-details-preview';

interface ExpandedInvoicePaymentsTableProps<
    TData extends { id: string | number },
> {
    row: Row<TData>;
    onReversalCallback: VoidFunction;
}

export const ExpandedInvoicePaymentsTable = memo(
    <TData extends { id: string | number }>({
        row,
        onReversalCallback,
    }: ExpandedInvoicePaymentsTableProps<TData>) => {
        const { invoicePayments, isLoadingInvoicePayments } =
            useInvoicePaymentsService(row.original.id.toString());

        const [showManualPaymentDetails, setShowManualPaymentDetails] =
            useState(false);
        const [showBankPaymentDetails, setShowBankPaymentDetails] =
            useState(false);
        const [selectedEntry, setSelectedEntry] =
            useState<PaymentDetailsEntry>();

        const handlePreviewDetails = (details: PaymentDetailsEntry) => {
            setSelectedEntry(details);
            const isBankPayment = details.bankTransactionId;
            if (isBankPayment) {
                setShowBankPaymentDetails(true);
            } else {
                setShowManualPaymentDetails(true);
            }
        };

        const columns = useExtendedPaymentsTableColumns(handlePreviewDetails);

        const { table } = useExtendedRowTable(invoicePayments, columns);

        return (
            <>
                <ExpendedTableRow
                    row={row}
                    isLoading={isLoadingInvoicePayments}
                    table={table}
                    components={EXPANDED_PAYMENTS_TABLE_COMPONENTS}
                />
                {showManualPaymentDetails && selectedEntry?.resourceId && (
                    <ManualPaymentDetailsPreview
                        isOpen={showManualPaymentDetails}
                        onClose={() => setShowManualPaymentDetails(false)}
                        selectedEntry={selectedEntry}
                        detailsCb={useGetReceivableDetails}
                        isPurchase={false}
                        onReversalCallback={onReversalCallback}
                    />
                )}
                {showBankPaymentDetails && selectedEntry && (
                    <BankPaymentDetailsPreview
                        isPurchase={false}
                        isOpen={showBankPaymentDetails}
                        onClose={() => setShowBankPaymentDetails(false)}
                        selectedEntry={selectedEntry}
                        detailsCb={useGetReceivableDetails}
                        onReversalCallback={onReversalCallback}
                    />
                )}
            </>
        );
    },
);
