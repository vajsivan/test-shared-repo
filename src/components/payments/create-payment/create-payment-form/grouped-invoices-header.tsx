import { Grid, Typography, useTheme } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const GroupedInvoicesHeader: FC = () => {
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Grid container px={2} pt={2} bgcolor={theme.palette.grey[100]}>
            <Grid item xs={2}>
                <Typography color={theme.palette.grey[500]}>
                    {t('labels.date')}
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography color={theme.palette.grey[500]}>
                    {t('crm.invoice').toNexCapitalizeFirstLetter()}
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography color={theme.palette.grey[500]}>
                    {t('crm.labels.due_date')}
                </Typography>
            </Grid>
            <Grid item xs={2} />
            <Grid item xs={3}>
                <Typography color={theme.palette.grey[500]} justifySelf="end">
                    {t('crm.labels.amount')}
                </Typography>
            </Grid>
        </Grid>
    );
};
