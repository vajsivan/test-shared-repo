import { Grid, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RHFBankAccountSelect } from 'src/components/bank-account-select';
import { isCompanyBankAccount } from 'src/components/bank-account-select/utils';
import { RHFDatePicker, RHFNumericTextField } from 'src/components/hook-form';
import { TextTruncation } from 'src/components/text';
import { useGetCompany, useGetExchangeRatesMutation } from 'src/services';
import { PaymentDetailsEntry } from 'src/types/payments';
import { RecordPaymentInvoice } from './types';

interface Props {
    index: number;
    invoice: RecordPaymentInvoice;
    handlePreviewInvoice: (details: PaymentDetailsEntry) => void;
}

export const RecordPaymentGridItem = ({
    index,
    invoice,
    handlePreviewInvoice,
}: Props) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const { company } = useGetCompany();

    const { setValue, control } = useFormContext();

    const watchPaymentDay = useWatch({
        control,
        name: `invoices[${index}].paymentDate`,
    });

    const watchAmount = useWatch({
        control,
        name: `invoices[${index}].amount`,
    });

    const watchExchangeRate = useWatch({
        control,
        name: `invoices[${index}].exchangeRate`,
    });

    const isInvoiceInBaseCurrency =
        invoice.currency === company?.baseCurrencyCode;

    const { getExchangeRates } = useGetExchangeRatesMutation();

    useEffect(() => {
        getExchangeRates(
            {
                date: dayjs(watchPaymentDay).toDate().toNexAPIDateFormat(),
                fromCurrency: company?.baseCurrencyCode ?? '',
            },
            {
                onSuccess: (response) => {
                    const exchangeRates = response.toCurrencies;
                    setValue(
                        `invoices[${index}].exchangeRate`,
                        isInvoiceInBaseCurrency
                            ? null
                            : exchangeRates[invoice.currency],
                    );
                    setValue(
                        `invoices[${index}].baseCurrencyAmount`,
                        isInvoiceInBaseCurrency
                            ? null
                            : watchAmount
                                  ?.toNexDecimalJS()
                                  .mul(exchangeRates[invoice.currency])
                                  .toNumber()
                                  .toNexCurrencyFormatted(),
                    );
                },
            },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchPaymentDay, company?.baseCurrencyCode]);

    const handleBaseCurrencyAmountChange = (value: number | null) => {
        setValue(
            `invoices[${index}].exchangeRate`,
            value
                ? watchAmount
                      ?.toNexDecimalJS()
                      .div(value)
                      .toNumber()
                      .toNexCurrencyFormatted()
                : '',
        );
    };

    const handleCurrencyExchangeRateChange = (value: number | null) => {
        setValue(
            `invoices[${index}].baseCurrencyAmount`,
            value
                ? watchAmount
                      ?.toNexDecimalJS()
                      .mul(value)
                      .toNumber()
                      .toNexCurrencyFormatted()
                : '',
        );
    };

    const handleAmountChange = (value: number | null) => {
        setValue(
            `invoices[${index}].baseCurrencyAmount`,
            value
                ? watchExchangeRate
                      ?.toNexDecimalJS()
                      .mul(value)
                      .toNumber()
                      .toNexCurrencyFormatted()
                : '',
        );
    };

    return (
        <Grid
            container
            direction="row"
            bgcolor={theme.palette.grey[100]}
            alignItems="center"
            borderRadius="8px"
            p={2}
            mb={2}
        >
            <Grid item xs={3} textOverflow="ellipsis" overflow="hidden">
                <TextTruncation
                    tooltip={invoice.contact.name}
                    sx={{
                        WebkitLineClamp: 2,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    <Typography color={theme.palette.grey[850]}>
                        {invoice.contact.name}
                    </Typography>
                </TextTruncation>
            </Grid>
            <Grid item xs={4} zIndex={10}>
                <Typography
                    color={theme.palette.grey[850]}
                    textOverflow="ellipsis"
                    overflow="hidden"
                    sx={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                    }}
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
            </Grid>
            <Grid item xs={2}>
                <Typography color={theme.palette.grey[850]}>
                    {invoice.issueDate?.toNexDateFormatted()}
                </Typography>
            </Grid>
            <Grid item xs={3}>
                {!!invoice.totalGrossPrice && (
                    <Typography
                        color={theme.palette.grey[850]}
                        justifySelf="end"
                    >
                        {invoice.totalGrossPrice.toNexCurrencyFormatted(
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
            </Grid>

            <Grid container spacing={2} pt={2}>
                <Grid item xs={4}>
                    <RHFBankAccountSelect
                        name={`invoices[${index}].glAccountNumber`}
                        bankAccountValueKey="glAccount.number"
                        hideIntegratedAccounts
                        label={t('crm.labels.bank_account')}
                        onAccountSelectedCb={(account) => {
                            if (isCompanyBankAccount(account)) {
                                setValue(
                                    `invoices[${index}].bankName`,
                                    account.bankName,
                                );
                                setValue(
                                    `invoices[${index}].iban`,
                                    account.iban,
                                );
                                setValue(
                                    `invoices[${index}].isIntegratedBankAccount`,
                                    false,
                                );
                            }
                        }}
                    />
                </Grid>

                <Grid item xs={isInvoiceInBaseCurrency ? 4 : 2.5}>
                    <RHFDatePicker
                        name={`invoices[${index}].paymentDate`}
                        label={t('crm.labels.payment_date')}
                        maxDate={new Date()}
                        defaultValue={new Date()}
                    />
                </Grid>

                <Grid item xs={isInvoiceInBaseCurrency ? 4 : 2}>
                    <RHFNumericTextField
                        name={`invoices[${index}].amount`}
                        label={t('crm.labels.amount')}
                        startAdornment={invoice.currency}
                        onChange={handleAmountChange}
                    />
                </Grid>
                {!isInvoiceInBaseCurrency && (
                    <>
                        <Grid item xs={1.5}>
                            <RHFNumericTextField
                                name={`invoices[${index}].exchangeRate`}
                                label={t('crm.labels.exchange_rate')}
                                onChange={handleCurrencyExchangeRateChange}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <RHFNumericTextField
                                name={`invoices[${index}].baseCurrencyAmount`}
                                label={t('crm.labels.base_currency_amount')}
                                startAdornment={company?.baseCurrencyCode}
                                onChange={handleBaseCurrencyAmountChange}
                            />
                        </Grid>
                    </>
                )}
            </Grid>
        </Grid>
    );
};
