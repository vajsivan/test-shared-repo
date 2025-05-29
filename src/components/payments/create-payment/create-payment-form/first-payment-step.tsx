import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { RHFNumericTextField } from 'src/components/hook-form';
import { useFormContext } from 'react-hook-form';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import { PaymentDetailsEntry } from 'src/types/payments';
import { TextTruncation } from 'src/components/text';
import { GroupedInvoicesHeader } from './grouped-invoices-header';
import { PayableInvoice } from '../types';

interface Props {
    handlePreviewInvoice: (details: PaymentDetailsEntry) => void;
}

export const FirstPaymentStep: FC<Props> = ({ handlePreviewInvoice }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const { getValues } = useFormContext();
    const purchases: PayableInvoice[] = getValues('purchases');

    const groupedInvoices = purchases.reduce<Record<number, PayableInvoice[]>>(
        (acc, purchase) => {
            if (!acc[purchase.supplierId]) {
                acc[purchase.supplierId] = [];
            }
            acc[purchase.supplierId].push(purchase);
            return acc;
        },
        {},
    );

    return Object.entries(groupedInvoices).map(
        ([supplierId, supplierInvoices]) => {
            if (supplierInvoices.length === 1) {
                const invoice = supplierInvoices[0];
                const index = purchases.findIndex((i) => i.id === invoice.id);

                return (
                    <Grid
                        container
                        direction="row"
                        bgcolor={theme.palette.grey[100]}
                        borderRadius="8px"
                        alignItems="center"
                        p={2}
                        my={2}
                        key={invoice.id}
                    >
                        <Grid
                            item
                            xs={2}
                            textOverflow="ellipsis"
                            overflow="hidden"
                        >
                            <TextTruncation
                                tooltip={invoice.supplierName}
                                sx={{
                                    WebkitLineClamp: 2,
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                <Typography color={theme.palette.grey[850]}>
                                    {invoice.supplierName}
                                </Typography>
                            </TextTruncation>
                        </Grid>

                        <Grid item xs={3} zIndex={10}>
                            <TextTruncation>
                                <Typography
                                    color={theme.palette.grey[850]}
                                    textOverflow="ellipsis"
                                    overflow="hidden"
                                    sx={{
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                    }}
                                    pr={2}
                                    onClick={() =>
                                        handlePreviewInvoice({
                                            resourceId: invoice.id,
                                            type: invoice.type,
                                            bookingId: invoice.bookingId,
                                        })
                                    }
                                >
                                    {invoice.invoiceNumber}
                                </Typography>
                            </TextTruncation>
                        </Grid>

                        <Grid xs={2} item>
                            <Typography color={theme.palette.grey[850]}>
                                {invoice.invoiceDate?.toNexDateFormatted()}
                            </Typography>
                        </Grid>

                        <Grid xs={2} item>
                            <Stack textAlign="end" width={1} px={2}>
                                {!!invoice.grossAmount && (
                                    <Typography>
                                        {invoice.grossAmount?.toNexCurrencyFormatted(
                                            invoice.currency,
                                            undefined,
                                            6,
                                        )}
                                    </Typography>
                                )}
                                {!!invoice.paidAmount && (
                                    <Typography
                                        color={theme.palette.grey[500]}
                                        fontSize={12}
                                        justifySelf="end"
                                    >
                                        {invoice.paidAmount?.toNexCurrencyFormatted(
                                            invoice.currency,
                                            undefined,
                                            6,
                                        )}
                                    </Typography>
                                )}
                            </Stack>
                        </Grid>

                        <Grid xs={3} item>
                            <RHFNumericTextField
                                name={`purchases[${index}].amount`}
                                label={t('crm.labels.amount')}
                                startAdornment={invoice.currency}
                                sx={{ flex: 2 }}
                            />
                        </Grid>
                    </Grid>
                );
            }

            return (
                <Accordion
                    key={supplierId}
                    sx={{
                        '&.MuiAccordion-root:before': {
                            display: 'none',
                        },
                    }}
                >
                    <AccordionSummary
                        sx={{
                            background: theme.palette.grey[50],
                            borderTopRightRadius:
                                theme.shape.borderRadius('sm'),
                            borderTopLeftRadius: theme.shape.borderRadius('sm'),
                            p: 2,
                            mt: 2,
                        }}
                    >
                        <Grid container direction="row">
                            <Grid item xs={3}>
                                <Typography color={theme.palette.grey[850]}>
                                    {supplierInvoices[0].supplierName}
                                </Typography>
                            </Grid>

                            <Grid item xs={4}>
                                <Typography
                                    color={theme.palette.grey[850]}
                                    sx={{ textDecoration: 'underline' }}
                                >
                                    {t('crm.labels.invoices_count', {
                                        count: supplierInvoices.length,
                                    })}
                                </Typography>
                            </Grid>

                            <Grid
                                item
                                xs={5}
                                justifyContent="flex-end"
                                display="flex"
                            >
                                <ArrowDropDownIcon />
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                        <GroupedInvoicesHeader />
                        {supplierInvoices.map((invoice, idx) => {
                            const index = purchases.findIndex(
                                (i) => i.id === invoice.id,
                            );
                            const isLast = idx === supplierInvoices.length - 1;

                            return (
                                <Grid
                                    container
                                    bgcolor={theme.palette.grey[100]}
                                    p={2}
                                    key={invoice.id}
                                    alignItems="center"
                                    sx={{
                                        borderBottomLeftRadius: isLast
                                            ? theme.shape.borderRadius('sm')
                                            : 0,
                                        borderBottomRightRadius: isLast
                                            ? theme.shape.borderRadius('sm')
                                            : 0,
                                    }}
                                >
                                    <Grid xs={2} item>
                                        <Typography
                                            color={theme.palette.grey[850]}
                                        >
                                            {invoice.invoiceDate}
                                        </Typography>
                                    </Grid>

                                    <Grid
                                        item
                                        xs={3}
                                        textOverflow="ellipsis"
                                        overflow="hidden"
                                        pr={2}
                                    >
                                        <TextTruncation>
                                            <Typography
                                                color={theme.palette.grey[850]}
                                                textOverflow="ellipsis"
                                                overflow="hidden"
                                                sx={{
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                }}
                                                pr={2}
                                                onClick={() =>
                                                    handlePreviewInvoice({
                                                        resourceId: invoice.id,
                                                        type: invoice.type,
                                                        bookingId:
                                                            invoice.bookingId,
                                                    })
                                                }
                                            >
                                                {invoice.invoiceNumber}
                                            </Typography>
                                        </TextTruncation>
                                    </Grid>

                                    <Grid
                                        item
                                        xs={2}
                                        textOverflow="ellipsis"
                                        overflow="hidden"
                                    >
                                        <Typography
                                            color={theme.palette.grey[850]}
                                        >
                                            {invoice.dueDate}
                                        </Typography>
                                    </Grid>

                                    <Grid xs={2} item>
                                        <Stack textAlign="end" width={1} px={2}>
                                            {!!invoice.grossAmount && (
                                                <Typography>
                                                    {invoice.grossAmount?.toNexCurrencyFormatted(
                                                        invoice.currency,
                                                        undefined,
                                                        6,
                                                    )}
                                                </Typography>
                                            )}
                                            {!!invoice.paidAmount && (
                                                <Typography
                                                    color={
                                                        theme.palette.grey[500]
                                                    }
                                                    fontSize={12}
                                                    justifySelf="end"
                                                >
                                                    {invoice.paidAmount?.toNexCurrencyFormatted(
                                                        invoice.currency,
                                                        undefined,
                                                        6,
                                                    )}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid xs={3} item>
                                        <RHFNumericTextField
                                            name={`purchases[${index}].amount`}
                                            label={t('crm.labels.amount')}
                                            startAdornment={invoice.currency}
                                            sx={{ flex: 2 }}
                                        />
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </AccordionDetails>
                </Accordion>
            );
        },
    );
};
