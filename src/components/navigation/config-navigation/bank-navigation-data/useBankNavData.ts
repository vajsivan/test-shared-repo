import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { bankPaths } from 'src/route';
import { NavListProps } from '../../types';
import { navIcon } from '../../utils';

export const useBankNavData = (): {
    subheader: string;
    items: NavListProps[];
}[] => {
    const { t } = useTranslation();
    const data = useMemo(
        () => [
            {
                subheader: t(
                    'nav_data.nav_company_config.nav_data_overview.subheader',
                ),
                items: [
                    {
                        title: t('banking.page.dashboard'),
                        icon: navIcon.dashboard,
                        path: bankPaths.bank.dashboard,
                    },
                    {
                        title: t('banking.page.transactions'),
                        icon: navIcon.arrows,
                        path: bankPaths.bank.transactions,
                    },
                    {
                        title: t('banking.page.payment_requests'),
                        icon: navIcon.coinStack,
                        path: bankPaths.bank.paymentRequests,
                    },
                ].filter(Boolean),
            },
        ],
        [t],
    );

    return data;
};
