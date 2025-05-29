import { useTranslation } from 'react-i18next';
import {
    Dispatch,
    FC,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    useTheme,
} from '@mui/material';
import { CrossIcon } from 'src/assets';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NexFormProvider } from 'src/components/hook-form';
import { UseMutateFunction } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { PaymentPostRequestBody } from 'src/services/types/crm';
import { useBookingErrorMapper } from 'src/components/hooks/use-booking-error-mapper';
import { useCRMErrorMapper } from 'src/components/hooks/use-crm-error-mapper';
import { NexAxiosError } from 'src/hooks/use-error-handler/types';
import { useToast } from 'src/components/nex-toast-permanent';
import { NexDataLoader } from 'src/components/loading-indicators';
import { PaymentDetailsEntry } from 'src/types/payments';
import { useErrorHandler } from 'src/hooks/use-error-handler';
import { getPaymentSchema } from './schema';
import { PayableInvoice } from './types';
import { CreatePaymentForm } from './create-payment-form';

interface Props {
    getInvoices: () => Promise<PayableInvoice[]>;
    isOpen: boolean;
    isLoading: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
    onSuccessPostCb?: () => void;
    handlePreviewInvoice: (details: PaymentDetailsEntry) => void;
    bankingTransferCb?: UseMutateFunction<
        AxiosResponse<any, any>,
        Error,
        PaymentPostRequestBody,
        unknown
    >;
    paymentFileCb?: UseMutateFunction<
        AxiosResponse<any, any>,
        Error,
        PaymentPostRequestBody,
        unknown
    >;
}

export const CreatePaymentDialog: FC<Props> = ({
    isOpen,
    isLoading,
    onClose,
    getInvoices,
    onSuccessPostCb,
    bankingTransferCb,
    paymentFileCb,
    handlePreviewInvoice,
}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { showToast } = useToast();
    const [invoices, setInvoices] = useState<PayableInvoice[]>([]);

    const [isSubmitStep, setIsSubmitStep] = useState(false);
    const schema = getPaymentSchema(isSubmitStep);

    // We are doing this async because on AP subledger we need to get purchase by id for each invoice
    useEffect(() => {
        (async () => {
            if (!invoices.length) getInvoices().then(setInvoices);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoices]);

    const initValues = useMemo(
        () => ({
            companyBankAccountId: null,
            isIntegratedBankAccount: false,
            currency: null,
            payDay: new Date(),
            purchases: invoices.map((invoice) => {
                const calculatedAmount = (invoice.grossAmount ?? 0)
                    .toNexDecimalJS()
                    .minus(invoice.paidAmount?.toNexDecimalJS() ?? 0)
                    .toNumber();

                return {
                    ...invoice,
                    contactBankAccountId: null,
                    amount: calculatedAmount < 0 ? null : calculatedAmount,
                };
            }),
        }),
        [invoices],
    );

    const methods = useForm({
        resolver: yupResolver(schema as any),
        values: initValues,
        mode: 'onChange',
    });

    const {
        handleSubmit,
        trigger,
        formState: { isValid },
        watch,
    } = methods;

    const watchIsIntegratedBankAccount = watch('isIntegratedBankAccount');

    const bookingErrorMapper = useBookingErrorMapper();
    const { errorHandler } = useErrorHandler(useCRMErrorMapper);

    const onSubmit = (isBankingTransfer: boolean) =>
        handleSubmit((data) => {
            if (!paymentFileCb || !data.companyBankAccountId) return;
            if (isBankingTransfer) {
                bankingTransferCb?.(
                    {
                        companyBankAccountId: data.companyBankAccountId,
                        currency: data.purchases[0].currency, // TODO: come back to this at some point once BE has decided what to do
                        payDay: data.payDay?.toNexAPIDateFormat(),
                        purchases: data.purchases,
                    },
                    {
                        onSuccess: () => {
                            onSuccessPostCb?.();
                            showToast(
                                t('crm.payment.toast.success_title'),
                                t('crm.payment.toast.success_body'),
                                'success',
                            );

                            onClose(false);
                        },
                        onError: (error) =>
                            errorHandler(error as NexAxiosError, undefined, [
                                bookingErrorMapper(),
                            ]),
                    },
                );
                onSuccessPostCb?.();
            } else {
                paymentFileCb(
                    {
                        companyBankAccountId: data.companyBankAccountId,
                        purchases: data.purchases,
                        payDay: data.payDay?.toNexAPIDateFormat() || '',
                        isIntegratedBankAccount: data.isIntegratedBankAccount,
                    },
                    {
                        onSuccess: () => {
                            onSuccessPostCb?.();
                            showToast(
                                t('crm.payment.toast.success_title'),
                                t('crm.payment.toast.success_body'),
                                'success',
                            );

                            onClose(false);
                        },
                        onError: (error) =>
                            errorHandler(error as NexAxiosError, undefined, [
                                bookingErrorMapper(),
                            ]),
                    },
                );
                onSuccessPostCb?.();
            }
        })();

    const handleNextStep = async () => {
        await trigger();
        if (isValid) {
            setIsSubmitStep(true);
        }
    };

    return (
        <Dialog
            id="new-payment-dialog"
            open={isOpen}
            onClose={() => onClose(false)}
            sx={{
                '& .MuiDialog-paper': {
                    minWidth: theme.typography.pxToRem(980),
                },
                zIndex: 500,
            }}
        >
            <NexFormProvider methods={methods}>
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between">
                        {t('crm.labels.new_payment')}
                        <Box onClick={() => onClose(false)}>
                            <CrossIcon
                                color={theme.palette.grey[600]}
                                width={24}
                                height={24}
                                sx={{
                                    cursor: 'pointer',
                                }}
                            />
                        </Box>
                    </Stack>
                </DialogTitle>

                <DialogContent>
                    {isLoading ? (
                        <NexDataLoader />
                    ) : (
                        <CreatePaymentForm
                            isSubmitStep={isSubmitStep}
                            handlePreviewInvoice={handlePreviewInvoice}
                        />
                    )}
                </DialogContent>

                <DialogActions>
                    <Stack
                        direction="row"
                        width={1}
                        justifyContent="space-between"
                    >
                        <Button
                            variant="secondary"
                            onClick={() => onClose(false)}
                        >
                            {t('general.cancel_button')}
                        </Button>

                        {isSubmitStep ? (
                            <Stack direction="row" gap={2}>
                                <LoadingButton
                                    onClick={() => onSubmit(false)}
                                    variant={
                                        watchIsIntegratedBankAccount
                                            ? 'tertiary'
                                            : 'primary'
                                    }
                                    loading={isLoading}
                                    disabled={!isValid}
                                >
                                    {t('crm.labels.generate_payment_file')}
                                </LoadingButton>

                                {watchIsIntegratedBankAccount && (
                                    <LoadingButton
                                        onClick={() => onSubmit(true)}
                                        variant="primary"
                                        loading={isLoading}
                                        disabled={!isValid}
                                    >
                                        {t('crm.labels.transfer_to_banking')}
                                    </LoadingButton>
                                )}
                            </Stack>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={handleNextStep}
                                sx={{ width: 160 }}
                            >
                                {t('general.next_button')}
                            </Button>
                        )}
                    </Stack>
                </DialogActions>
            </NexFormProvider>
        </Dialog>
    );
};
