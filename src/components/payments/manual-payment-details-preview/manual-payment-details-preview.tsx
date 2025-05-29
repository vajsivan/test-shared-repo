import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Stack,
    Typography,
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
} from 'src/services/api/shared';
import { BookingPreview } from 'src/types/booking-preview';
import { accountingPaths } from 'src/route/accounting-paths';
import { CrossIcon, ReversalIcon } from 'src/assets/icons';
import { LatestBooking } from 'src/components/latest-booking/latest-booking';
import { NexDataLoader } from 'src/components/loading-indicators';
import { NexChip } from 'src/components/nex-chip/nex-chip';
import { useToast } from 'src/components/nex-toast-permanent';
import { useCRMErrorMapper } from 'src/components/hooks/use-crm-error-mapper';
import { NexAxiosError, useErrorHandler } from 'src/hooks/use-error-handler';
import { getVariantForInvoiceStatus } from 'src/components/invoice-related';
import { MetadataText } from '../metadata-text';
import { ReversalUnmatchConfirmationDialog } from '../revert-confirmation-dialog';

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

export const ManualPaymentDetailsPreview: FC<Props> = ({
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

    const [isConfirmationStep, setIsConfirmationStep] = useState(false);

    const { errorHandler } = useErrorHandler(useCRMErrorMapper);

    const closeConfirmationHandler = () => {
        setIsConfirmationStep(false);
    };

    const { data, isLoading } = detailsCb(selectedEntry.resourceId);

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
                id="manual-payment-details-preview-dialog"
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
                        {t('banking.general.payment_preview')}
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

                    <Stack spacing={2} my={4}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body1Bold">
                                {t('labels.information')}
                            </Typography>
                            <Button
                                sx={{ py: 0, px: 2 }}
                                startIcon={
                                    <ReversalIcon p={0} bgcolor="transparent" />
                                }
                                variant="secondary"
                                onClick={() => setIsConfirmationStep(true)}
                                disabled={
                                    data?.status !== PaymentStatusEnum.PAID ||
                                    !data
                                }
                            >
                                {t('crm.payment.revert_recording')}
                            </Button>
                        </Stack>

                        <MetadataText
                            label={t('labels.iban')}
                            value={data?.iban}
                        />

                        <MetadataText
                            label={t('labels.currency')}
                            value={data?.currency}
                        />

                        <MetadataText
                            label={t('labels.amount')}
                            value={data?.amount?.toNexDecimalFormatted()}
                        />

                        <MetadataText
                            label={t('labels.payment_date')}
                            value={data?.paymentDate?.toNexDateFormatted()}
                        />

                        {data?.status && (
                            <Stack direction="row">
                                <Typography
                                    color={(theme) => theme.palette.grey[500]}
                                    fontSize={14}
                                    sx={{ minWidth: '42%' }}
                                >
                                    {t('crm.labels.status')}
                                </Typography>
                                <NexChip
                                    variant={getVariantForInvoiceStatus(
                                        data?.status,
                                    )}
                                >
                                    {t(`crm.enums.${data?.status}`)}
                                </NexChip>
                            </Stack>
                        )}
                    </Stack>

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
