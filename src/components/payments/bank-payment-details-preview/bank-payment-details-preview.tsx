import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import { pxToRem } from 'src/theme/typography';
import { PaymentDetailsEntry } from 'src/types/payments/invoice-payment';
import {
    PaymentStatusEnum,
    SubledgerPaymentDetailsResponse,
} from 'src/services/types/shared';
import {
    useDeleteInvoicePayment,
    useDeletePurchasePayment,
    useGetTransaction,
} from 'src/services/api/shared';
import { BookingPreview } from 'src/types/booking-preview';
import { accountingPaths } from 'src/route/accounting-paths';
import {
    CrossIcon,
    GreenArrowIncoming,
    RedArrowOutgoing,
    ReversalIcon,
} from 'src/assets/icons';
import { LatestBooking } from 'src/components/latest-booking/latest-booking';
import { NexDataLoader } from 'src/components/loading-indicators';
import { useToast } from 'src/components/nex-toast-permanent';
import { useCRMErrorMapper } from 'src/components/hooks/use-crm-error-mapper';
import { NexAxiosError, useErrorHandler } from 'src/hooks/use-error-handler';
import { TransactionTypeEnum } from 'src/types/enums';
import { ReversalUnmatchConfirmationDialog } from '../revert-confirmation-dialog';
import { MetadataText } from '../metadata-text';
import { MatchedPayments } from '../matched-payments';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    selectedEntry: PaymentDetailsEntry;
    detailsCb: (id: number) => {
        data: SubledgerPaymentDetailsResponse | undefined;
        isLoading: boolean;
        isError: boolean;
    };
    isPurchase: boolean;
    onReversalCallback?: () => void;
}

export const BankPaymentDetailsPreview: FC<Props> = ({
    isOpen,
    onClose,
    selectedEntry,
    detailsCb,
    isPurchase,
    onReversalCallback,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const theme = useTheme();

    const [isConfirmationStep, setIsConfirmationStep] = useState(false);

    const { errorHandler } = useErrorHandler(useCRMErrorMapper);

    const closeConfirmationHandler = () => {
        setIsConfirmationStep(false);
    };

    const { data, isLoading } = detailsCb(selectedEntry.resourceId);
    const { transaction } = useGetTransaction(data?.bankTransactionId);

    const isIncome =
        transaction?.transactionType === TransactionTypeEnum.CREDIT;
    const { deleteInvoicePayment } = useDeleteInvoicePayment();
    const { deletePurchasePayment } = useDeletePurchasePayment();

    const goToJournalHandler = (booking: BookingPreview) => {
        if (!data) return;
        navigate({
            pathname: accountingPaths.company.financeJournal,
            search: `?${createSearchParams({
                type: 'journal',
                bookingIds: encodeURIComponent(booking?.id?.toString()),
                dateFrom:
                    booking.bookingDate?.toNexDate()?.toNexAPIDateFormat() ??
                    '',
            })}`,
        });
    };

    const reversalHandler = () => {
        if (isPurchase) {
            deletePurchasePayment(selectedEntry.resourceId, {
                onSuccess: () => {
                    onReversalCallback?.();
                    onClose();
                    showToast(
                        t('crm.toast.record_success_title'),
                        t('crm.toast.record_success_body'),
                        'success',
                    );
                },
                onError: (error) => {
                    onClose();
                    errorHandler(error as NexAxiosError);
                },
            });
        } else {
            deleteInvoicePayment(selectedEntry.resourceId, {
                onSuccess: () => {
                    onReversalCallback?.();
                    onClose();
                    showToast(
                        t('crm.toast.record_success_title'),
                        t('crm.toast.record_success_body'),
                        'success',
                    );
                },
                onError: (error) => {
                    onClose();
                    errorHandler(error as NexAxiosError);
                },
            });
        }
    };

    return (
        <>
            <Dialog
                id="bank-payment-details-preview-dialog"
                open={isOpen}
                onClose={onClose}
                sx={{
                    '& .MuiDialog-paper': {
                        width: pxToRem(980),
                    },
                }}
            >
                <Stack direction="row" justifyContent="space-between">
                    <DialogTitle>
                        {isIncome ? (
                            <GreenArrowIncoming />
                        ) : (
                            <RedArrowOutgoing />
                        )}
                        {` ${t('banking.transaction_details.title')}`}
                    </DialogTitle>

                    <Box onClick={onClose}>
                        <CrossIcon
                            color="black"
                            width={24}
                            height={24}
                            sx={{
                                cursor: 'pointer',
                            }}
                        />
                    </Box>
                </Stack>

                <DialogContent>
                    {isLoading && <NexDataLoader />}
                    <Stack direction="row" width={1} justifyContent="flex-end">
                        <Button
                            sx={{ py: 0, px: 2 }}
                            startIcon={
                                <ReversalIcon p={0} bgcolor="transparent" />
                            }
                            variant="secondary"
                            onClick={() => setIsConfirmationStep(true)}
                            disabled={
                                data?.status !== PaymentStatusEnum.PAID || !data
                            }
                        >
                            {t('crm.payment.revert_recording')}
                        </Button>
                    </Stack>

                    <Stack direction="row" width={1} my={4}>
                        <Stack width={0.5} spacing={1}>
                            <Typography
                                variant="body1Bold"
                                color={theme.palette.grey[850]}
                            >
                                {` ${t('banking.transaction_details.transaction_info')}`}
                            </Typography>
                            <MetadataText
                                label={t('banking.transaction_details.id')}
                                value={transaction?.externalEntryId}
                            />
                            <MetadataText
                                label={t('banking.general.date')}
                                value={
                                    transaction?.createdDate
                                        ? transaction?.createdDate.toNexDateFormatted()
                                        : ''
                                }
                            />
                            <MetadataText
                                label={t('banking.general.type')}
                                value={transaction?.transactionType}
                            />

                            <MetadataText
                                label={t(
                                    'banking.transaction_details.bank_name',
                                )}
                                value={transaction?.providerName}
                            />

                            <MetadataText
                                label={t(
                                    'banking.transaction_details.reason_for_payment',
                                )}
                                value={transaction?.reasonForPayment}
                            />

                            <MetadataText
                                label={t('banking.general.status')}
                                value={
                                    transaction?.booked
                                        ? t('banking.general.booked')
                                        : t('banking.general.not_booked')
                                }
                                valueColor={
                                    transaction?.booked
                                        ? theme.palette.success[60]
                                        : theme.palette.error[50]
                                }
                            />

                            <MetadataText
                                label={t('banking.general.amount')}
                                value={transaction?.amount.toNexCurrencyFormatted(
                                    transaction?.currency,
                                )}
                            />
                        </Stack>

                        <Stack width={0.5} spacing={1}>
                            <Typography
                                variant="body1Bold"
                                color={theme.palette.grey[850]}
                            >
                                {` ${t('banking.transaction_details.more_info')}`}
                            </Typography>

                            <MetadataText
                                label={t(
                                    'banking.transaction_details.trade_date',
                                )}
                                value={
                                    transaction?.tradeDate
                                        ? transaction?.tradeDate.toNexDateFormatted()
                                        : ''
                                }
                            />

                            <MetadataText
                                label={t(
                                    'banking.transaction_details.debit_credit',
                                )}
                                value={`${isIncome ? '+ ' : '- '} ${transaction?.amount.toNexCurrencyFormatted(transaction?.currency)}`}
                            />

                            <MetadataText
                                label={t(
                                    'banking.transaction_details.value_date',
                                )}
                                value={
                                    transaction?.valueDate
                                        ? transaction?.valueDate.toNexDateFormatted()
                                        : ''
                                }
                            />

                            <Stack mt={4}>
                                <Typography
                                    variant="body1Bold"
                                    color={theme.palette.grey[850]}
                                >
                                    {` ${t('banking.transaction_details.counterparty_information')}`}
                                </Typography>
                            </Stack>

                            <MetadataText
                                label={t('banking.transaction_details.name')}
                                value={transaction?.counterparty?.name}
                            />

                            <MetadataText
                                label={t('banking.transaction_details.address')}
                                value={transaction?.counterparty?.addressLine}
                            />
                        </Stack>
                    </Stack>

                    {transaction && (
                        <MatchedPayments transaction={transaction} />
                    )}

                    {selectedEntry.bookingId && (
                        <LatestBooking
                            bookingId={selectedEntry.bookingId}
                            isExpendedDefaultValue
                            onGoToJournal={goToJournalHandler}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {isConfirmationStep && (
                <ReversalUnmatchConfirmationDialog
                    isOpen={isConfirmationStep}
                    onClose={closeConfirmationHandler}
                    callback={reversalHandler}
                    type="reversal"
                />
            )}
        </>
    );
};
