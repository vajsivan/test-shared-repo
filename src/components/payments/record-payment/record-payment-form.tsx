import { NexFormProvider } from 'src/components/hook-form';
import { UseFormReturn } from 'react-hook-form';

import { PaymentDetailsEntry } from 'src/types';
import { RecordPaymentInvoice } from './types';
import { RecordPaymentSchemaType } from './schema';
import { RecordPaymentGridItem } from './record-payment-grid-item';

interface Props {
    invoices: RecordPaymentInvoice[];
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    methods: UseFormReturn<RecordPaymentSchemaType>;
    handlePreviewInvoice: (details: PaymentDetailsEntry) => void;
}

export const RecordPaymentForm = ({
    invoices,
    methods,
    onSubmit,
    handlePreviewInvoice,
}: Props) => (
    <NexFormProvider methods={methods} onSubmit={onSubmit}>
        {invoices.map((invoice, index) => (
            <RecordPaymentGridItem
                key={`record-payment-row-${index}`}
                index={index}
                invoice={invoice}
                handlePreviewInvoice={handlePreviewInvoice}
            />
        ))}
    </NexFormProvider>
);
