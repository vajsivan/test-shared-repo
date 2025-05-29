import { Button, Grid, MenuItem, Typography, useTheme } from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RHFSelect } from 'src/components/hook-form';
import { useGetContactBankAccounts } from 'src/services/api/shared/contacts-queries/hooks';
import { useFormContext, useWatch } from 'react-hook-form';
import { Stack } from '@mui/system';
import { PlusIcon, WarningIcon } from 'src/assets/icons';
import { UpsertContactBankAccountDialog } from 'src/components/bank-account-dialog';
import { useSearchParams } from 'react-router-dom';
import { PayableInvoice } from '../types';

interface Props {
    purchase: PayableInvoice;
    index: number;
}

export const PaymentCustomerRow: FC<Props> = ({ purchase, index }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isAddBankDialogOpened, setIsAddBankDialogOpened] = useState(false);
    const { setValue, control } = useFormContext();

    const { supplierId, supplierIBAN } = purchase;

    const { contactBankAccounts = [], isLoading } = useGetContactBankAccounts(
        supplierId.toString(),
    );

    // check if contact has bank account with invoice IBAN
    const doesSupplierIbanExistsInBankAccounts = useMemo(
        () =>
            !!contactBankAccounts.find(
                (bankAccount) => bankAccount.iban === supplierIBAN,
            ),
        [contactBankAccounts, supplierIBAN],
    );

    // watch iban change, if user select existing bank account we shoud hide banner
    const watchSelectedIban = useWatch({
        control,
        name: `purchases[${index}].contactBankAccountIban`,
    });

    // get bank account based on selected IBAN
    const selectedBankAccount = useMemo(
        () =>
            contactBankAccounts.find(
                (bankAccount) => bankAccount.iban === watchSelectedIban,
            ),
        [watchSelectedIban, contactBankAccounts],
    );

    // set contact bank account ID based on selected bank account
    useEffect(() => {
        setValue(
            `purchases[${index}].contactBankAccountId`,
            selectedBankAccount?.id || null,
            { shouldValidate: true },
        );
    }, [selectedBankAccount, setValue, index]);

    // set init value, do like this because this cmp is re-rendered multiple times
    useEffect(() => {
        if (supplierIBAN) {
            setValue(
                `purchases[${index}].contactBankAccountIban`,
                supplierIBAN,
            );
        }
    }, [supplierIBAN, index, setValue]);

    const addBankButtonHandler = () => {
        searchParams.set('contactCreationId', supplierId.toString());
        setSearchParams(searchParams);
        setIsAddBankDialogOpened(true);
    };

    //  show banner only in case we have supplier iban and do not have selected bank
    const showSupplierIBANBanner =
        !isLoading && !!supplierIBAN && !selectedBankAccount;

    // show banner when we do not have any contact bank accounts
    const showNoSupplierBanksBanner = !isLoading && !contactBankAccounts.length;

    const banner = useMemo(() => {
        const getBanner = () => {
            if (showSupplierIBANBanner)
                return (
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        bgcolor={theme.palette.error[40]}
                        p={2}
                    >
                        <Stack>
                            <Stack direction="row" spacing={1}>
                                <WarningIcon
                                    color={theme.palette.warning[70]}
                                />
                                <Typography variant="body2Bold">
                                    {t(
                                        'crm.labels.contact_missing_bank-account.title',
                                    )}
                                </Typography>
                            </Stack>
                            <Typography variant="body2Regular">
                                {t(
                                    'crm.labels.contact_missing_bank-account.text',
                                )}
                            </Typography>
                        </Stack>

                        <Button
                            size="small"
                            variant="secondary"
                            startIcon={<PlusIcon />}
                            onClick={() => addBankButtonHandler()}
                        >
                            {t(
                                'crm.labels.contact_missing_bank-account.add_button',
                            )}
                        </Button>
                    </Stack>
                );

            if (showNoSupplierBanksBanner)
                return (
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        bgcolor={theme.palette.warning[40]}
                        p={2}
                    >
                        <Stack>
                            <Stack direction="row" spacing={1}>
                                <WarningIcon
                                    color={theme.palette.warning[70]}
                                />
                                <Typography variant="body2Bold">
                                    {t(
                                        'crm.labels.contact-no-bank-accounts.title',
                                    )}
                                </Typography>
                            </Stack>
                            <Typography variant="body2Regular">
                                {t('crm.labels.contact-no-bank-accounts.text')}
                            </Typography>
                        </Stack>

                        <Button
                            size="small"
                            variant="secondary"
                            startIcon={<PlusIcon />}
                            onClick={() => addBankButtonHandler()}
                        >
                            {t(
                                'crm.labels.contact_missing_bank-account.add_button',
                            )}
                        </Button>
                    </Stack>
                );

            return null;
        };

        const getBorder = () => {
            if (showSupplierIBANBanner)
                return `2px solid ${theme.palette.error[40]}`;

            if (showNoSupplierBanksBanner)
                return `2px solid ${theme.palette.warning[40]}`;

            return 'none';
        };

        return {
            content: getBanner(),
            border: getBorder(),
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSupplierIBANBanner, showNoSupplierBanksBanner]);

    return (
        <>
            <Stack
                borderRadius="8px"
                my={2}
                overflow="hidden"
                sx={{
                    border: banner.border,
                }}
            >
                <Grid
                    container
                    direction="row"
                    bgcolor={theme.palette.grey[100]}
                    p={2}
                >
                    <Grid item xs={3} textOverflow="ellipsis" overflow="hidden">
                        <Typography color={theme.palette.grey[850]}>
                            {purchase.supplierName}
                        </Typography>
                    </Grid>

                    <Grid item xs={3}>
                        <Typography color={theme.palette.grey[850]}>
                            {(purchase.amount ?? 0).toNexCurrencyFormatted(
                                purchase.currency,
                            )}
                        </Typography>
                    </Grid>

                    <Grid xs={6} item>
                        <RHFSelect
                            name={`purchases[${index}].contactBankAccountIban`}
                            label={t('crm.labels.supplier_bank_account')}
                            sx={{ width: '100%' }}
                        >
                            {contactBankAccounts.map((option) => (
                                <MenuItem key={option.id} value={option.iban}>
                                    {`${option.bankName ? `${option.bankName} -` : ''} ${option.iban}`}
                                </MenuItem>
                            ))}

                            {/* add option item if supplier iban is not in the list */}
                            {supplierIBAN &&
                                !doesSupplierIbanExistsInBankAccounts && (
                                    <MenuItem
                                        key={supplierIBAN}
                                        value={supplierIBAN}
                                    >
                                        {supplierIBAN}
                                    </MenuItem>
                                )}
                        </RHFSelect>
                    </Grid>
                </Grid>

                {banner.content}
            </Stack>

            {isAddBankDialogOpened && (
                <UpsertContactBankAccountDialog
                    bankAccount={{
                        iban: supplierIBAN || '',
                        bankName: '',
                        currency: '',
                        designation: '',
                        swift: '',
                    }}
                    isOpen={isAddBankDialogOpened}
                    onClose={(requestData) => {
                        setIsAddBankDialogOpened(false);
                        if (requestData) {
                            setValue(
                                `purchases[${index}].contactBankAccountIban`,
                                requestData.iban,
                            );
                        }
                    }}
                    existingAccounts={contactBankAccounts}
                />
            )}
        </>
    );
};
