import { Row } from '@tanstack/react-table';
import { ExpendedTableRow } from 'src/components/nex-table';
import { memo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePurchasePaymentsService } from 'src/services/api/shared/payment-queries/hooks/use-purchase-payments-service';
import { PaymentDetailsEntry } from 'src/types/payments/invoice-payment';
import { sharedQueriesFactory } from 'src/services/api/shared/shared-queries';
import { useGetPayableDetails } from 'src/services/api/shared/payment-queries/hooks/use-invoice-payments-service';
import { purchasesPaymentsQueriesFactory } from 'src/services';
import { useExtendedPaymentsTableColumns, useExtendedRowTable } from './hooks';
import { EXPANDED_PAYMENTS_TABLE_COMPONENTS } from './constants';
import { ManualPaymentDetailsPreview } from '../manual-payment-details-preview/manual-payment-details-preview';
import { BankPaymentDetailsPreview } from '../bank-payment-details-preview';

interface ExpandedPurchasePaymentsTableProps<TData extends { id: number }> {
    row: Row<TData>;
    onReversalCallback: () => void;
}

export const ExpandedPurchasePaymentsTable = memo(
    <TData extends { id: number }>({
        row,
        onReversalCallback,
    }: ExpandedPurchasePaymentsTableProps<TData>) => {
        const queryClient = useQueryClient();
        const { purchasePayments, isLoadingPurchasePayments } =
            usePurchasePaymentsService(row.original.id);

        const [showManualPaymentDetails, setShowManualPaymentDetails] =
            useState(false);
        const [showBankPaymentDetails, setShowBankPaymentDetails] =
            useState(false);
        const [selectedEntry, setSelectedEntry] =
            useState<PaymentDetailsEntry>();

        const invalidateQueryOnReversal = () => {
            queryClient.invalidateQueries({
                queryKey: [
                    ...sharedQueriesFactory.baseEntityKey,
                    'purchasesList',
                ],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    ...purchasesPaymentsQueriesFactory.baseEntityKey,
                    'getPurchasesPayments',
                    row.original.id,
                ],
            });
        };

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

        const { table } = useExtendedRowTable(purchasePayments, columns);

        return (
            <>
                <ExpendedTableRow
                    row={row}
                    isLoading={isLoadingPurchasePayments}
                    table={table}
                    components={EXPANDED_PAYMENTS_TABLE_COMPONENTS}
                />
                {showManualPaymentDetails && selectedEntry?.resourceId && (
                    <ManualPaymentDetailsPreview
                        isPurchase
                        isOpen={showManualPaymentDetails}
                        onClose={() => setShowManualPaymentDetails(false)}
                        selectedEntry={selectedEntry}
                        detailsCb={useGetPayableDetails}
                        onReversalCallback={() => {
                            invalidateQueryOnReversal();
                            onReversalCallback();
                        }}
                    />
                )}
                {showBankPaymentDetails && selectedEntry && (
                    <BankPaymentDetailsPreview
                        isPurchase
                        isOpen={showBankPaymentDetails}
                        onClose={() => setShowBankPaymentDetails(false)}
                        selectedEntry={selectedEntry}
                        detailsCb={useGetPayableDetails}
                        onReversalCallback={() => {
                            invalidateQueryOnReversal();
                            onReversalCallback();
                        }}
                    />
                )}
            </>
        );
    },
);
