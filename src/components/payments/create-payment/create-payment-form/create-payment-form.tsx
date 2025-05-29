import { Grid, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RHFDatePicker } from 'src/components/hook-form';

import { PaymentDetailsEntry } from 'src/types/payments';
import { RHFBankAccountSelect } from 'src/components/bank-account-select';
import { useFormContext } from 'react-hook-form';
import {
    CompanyBankAccount,
    IntegratedCompanyBankAccountResponse,
} from 'src/services';
import { PaymentFormHeader } from './payment-form-header';
import { FirstPaymentStep } from './first-payment-step';
import { SecondPaymentStep } from './second-payment-step';

interface Props {
    isSubmitStep: boolean;
    handlePreviewInvoice: (details: PaymentDetailsEntry) => void;
}

export const CreatePaymentForm: FC<Props> = ({
    isSubmitStep,
    handlePreviewInvoice,
}) => {
    const { t } = useTranslation();

    const { setValue } = useFormContext();

    return (
        <>
            {!isSubmitStep && (
                <Grid container spacing={2} pt={2}>
                    <Grid item xs={6}>
                        <RHFBankAccountSelect
                            name="companyBankAccountId"
                            label={t('crm.labels.bank_account')}
                            onAccountSelectedCb={(
                                account:
                                    | CompanyBankAccount
                                    | IntegratedCompanyBankAccountResponse,
                                isIntegratedAccount,
                            ) => {
                                if (isIntegratedAccount) {
                                    setValue('isIntegratedBankAccount', true);
                                    setValue('currency', account.currency);
                                } else {
                                    setValue('isIntegratedBankAccount', false);
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <RHFDatePicker
                            name="payDay"
                            label={t('crm.labels.payment_date')}
                            minDate={new Date()}
                        />
                    </Grid>
                </Grid>
            )}

            <Stack pt={4}>
                <Typography variant="body2Bold">{t('crm.invoices')}</Typography>
            </Stack>

            {!isSubmitStep && <PaymentFormHeader />}

            {isSubmitStep ? (
                <SecondPaymentStep />
            ) : (
                <FirstPaymentStep handlePreviewInvoice={handlePreviewInvoice} />
            )}
        </>
    );
};
