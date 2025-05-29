import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { PaymentCustomerRow } from './payment-customer-row';
import { PayableInvoice } from '../types';

export const SecondPaymentStep: FC = () => {
    const { getValues } = useFormContext();

    const purchases = getValues('purchases');

    return purchases.map((purchase: PayableInvoice, index: number) => (
        <PaymentCustomerRow
            index={index}
            key={purchase.id}
            purchase={purchase}
        />
    ));
};
