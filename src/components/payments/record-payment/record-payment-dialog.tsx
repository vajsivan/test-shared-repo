import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CrossIcon } from 'src/assets';

import { useBookingErrorMapper, useCRMErrorMapper } from 'src/components/hooks';
import { useToast } from 'src/components/nex-toast-permanent';
import { NexAxiosError, useErrorHandler } from 'src/hooks/use-error-handler';
import { RecordPaymentPostRequestBody, useGetCompany } from 'src/services';
import { usePostRecordPayment } from 'src/services/api';
import { PaymentDetailsEntry, PaymentTypeEnum } from 'src/types';
import { RecordPaymentForm } from './record-payment-form';
import { getRecordPaymentSchema, RecordPaymentSchemaType } from './schema';
import { RecordPaymentInvoice } from './types';

interface Props {
    getInvoices: () => Promise<RecordPaymentInvoice[]>;
    isOpen: boolean;
    onClose: Dispatch<SetStateAction<boolean>>;
    onSuccessPostCb?: () => void;
    handlePreviewInvoice: (details: PaymentDetailsEntry) => void;
    paymentType: PaymentTypeEnum;
}

export const RecordPaymentDialog = ({
    getInvoices,
    isOpen,
    onClose,
    onSuccessPostCb,
    handlePreviewInvoice,
    paymentType,
}: Props) => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const theme = useTheme();
    const { postPaymentRequests, isPostPaymentRequestsPending } =
        usePostRecordPayment();
    const bookingErrorMapper = useBookingErrorMapper();
    const { errorHandler } = useErrorHandler(useCRMErrorMapper);
    const [invoices, setInvoices] = useState<RecordPaymentInvoice[]>([]);
    const { company } = useGetCompany();

    const handleError = (error: NexAxiosError) => {
        errorHandler(error, undefined, [
            bookingErrorMapper({
                FISCAL_YEAR_NOT_FOUND: {
                    title: t('api_errors.FISCAL_YEAR_NOT_FOUND_WITH_PARAMS', {
                        fiscalYear:
                            error?.response?.data?.references?.[0]?.value ?? '',
                    }),
                },
                FISCAL_YEAR_ALREADY_CLOSED: {
                    title: t(
                        'api_errors.FISCAL_YEAR_ALREADY_CLOSED_WITH_PARAMS',
                        {
                            fiscalYear:
                                error?.response?.data?.references?.[0]?.value ??
                                '',
                        },
                    ),
                },
            }),
        ]);
    };

    // We are doing this async because on AP subledger we need to get purchase by id for each invoice
    useEffect(() => {
        (async () => {
            if (!invoices.length) getInvoices().then(setInvoices);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoices]);

    const schema = getRecordPaymentSchema(company?.baseCurrencyCode ?? 'CHF');

    const initValues = useMemo<RecordPaymentSchemaType>(
        () => ({
            invoices: invoices.map((invoice) => {
                const calculatedAmount = (invoice.totalGrossPrice ?? 0)
                    .toNexDecimalJS()
                    .minus(invoice.paidAmount?.toNexDecimalJS() ?? 0)
                    .toNumber();

                return {
                    id: invoice.id,
                    currency: invoice.currency,
                    glAccountNumber: null,
                    paymentDate: new Date(),
                    amount: calculatedAmount < 0 ? null : calculatedAmount,
                    bankName: '',
                    iban: '',
                    exchangeRate: 0,
                    baseCurrencyAmount: 0,
                };
            }),
        }),
        [invoices],
    );

    const methods = useForm<RecordPaymentSchemaType>({
        resolver: yupResolver(schema),
        values: initValues,
    });

    const { handleSubmit } = methods;

    const onSubmit = handleSubmit(
        (data) => {
            const apiData = data.invoices?.map(
                (invoice) =>
                    ({
                        amount: invoice.amount,
                        currency: invoice.currency,
                        bankName: invoice.bankName,
                        iban: invoice.iban,
                        glAccountNumber: invoice.glAccountNumber,
                        exchangeRate: invoice.exchangeRate,
                        baseCurrencyAmount: invoice.baseCurrencyAmount,
                        paymentDate:
                            invoice.paymentDate?.toNexAPIDateFormat() || '',
                        ...(paymentType === PaymentTypeEnum.PURCHASE
                            ? { purchaseId: invoice.id }
                            : { invoiceId: invoice.id }),
                    }) as RecordPaymentPostRequestBody, // TODO Fix types
            );

            if (apiData) {
                postPaymentRequests(
                    { recordPayments: apiData, paymentType },
                    {
                        onSuccess: () => {
                            onSuccessPostCb?.();

                            showToast(
                                t('crm.record_payment.toast.success_title'),
                                t('crm.record_payment.toast.success_body'),
                                'success',
                            );

                            onClose(false);
                        },
                        onError: (error) => handleError(error as NexAxiosError),
                    },
                );
            }
        },
        (error) => {
            console.error(error);
        },
    );

    return (
        <Dialog
            id="create-record-dialog"
            open={isOpen}
            onClose={() => onClose(false)}
            sx={{
                '& .MuiDialog-paper': {
                    width: theme.typography.pxToRem(1080),
                    maxWidth: theme.typography.pxToRem(1080),
                },
                zIndex: 500,
            }}
        >
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between">
                    {t('crm.record_payment.label')}
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
                <Typography
                    variant="body3Regular"
                    color={theme.palette.grey[500]}
                >
                    {t('crm.record_payment.subtitle')}
                </Typography>
                <Stack pt={4}>
                    <Typography variant="body2Bold">
                        {t('crm.invoices')}
                    </Typography>
                </Stack>

                <Grid container px={2} pt={2}>
                    <Grid item xs={3}>
                        <Typography color={theme.palette.grey[500]}>
                            {t('labels.supplier')}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography color={theme.palette.grey[500]}>
                            {t('crm.invoice').toNexCapitalizeFirstLetter()}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography color={theme.palette.grey[500]}>
                            {t('crm.labels.invoice_date')}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography
                            color={theme.palette.grey[500]}
                            justifySelf="end"
                        >
                            {t('crm.labels.total_amount')}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogTitle>

            <DialogContent>
                <RecordPaymentForm
                    invoices={invoices}
                    methods={methods}
                    onSubmit={onSubmit}
                    handlePreviewInvoice={handlePreviewInvoice}
                />
            </DialogContent>

            <DialogActions>
                <Stack direction="row" width={1} justifyContent="space-between">
                    <Button variant="secondary" onClick={() => onClose(false)}>
                        {t('general.cancel_button')}
                    </Button>
                    <LoadingButton
                        onClick={onSubmit}
                        variant="primary"
                        loading={isPostPaymentRequestsPending}
                    >
                        {t('crm.record_payment.label')}
                    </LoadingButton>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};
