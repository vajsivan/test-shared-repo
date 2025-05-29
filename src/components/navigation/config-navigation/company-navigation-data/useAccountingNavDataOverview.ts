import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { accountingPaths } from 'src/route';
import { NavListProps } from '../../types';
import { navIcon } from '../../utils';

export const useAccountingNavDataOverview = (): {
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
                        title: t(
                            'nav_data.nav_company_config.nav_data_overview.dashboard',
                        ),
                        path: accountingPaths.company.dashboard,
                        icon: navIcon.dashboard,
                    },
                    {
                        title: t(
                            'nav_data.nav_company_config.nav_data_overview.documents',
                        ),
                        path: accountingPaths.company.documents,
                        icon: navIcon.documents,
                    },

                    {
                        title: t(
                            'nav_data.nav_company_config.nav_data_overview.accounts_receivable',
                        ),
                        path: accountingPaths.company.accountsReceivable,
                        icon: navIcon.accountsReceivable,
                    },

                    {
                        title: t(
                            'nav_data.nav_company_config.nav_data_overview.accounts_payable',
                        ),
                        path: accountingPaths.company.accountsPayable,
                        icon: navIcon.accountPayable,
                    },

                    {
                        title: t(
                            'nav_data.nav_company_config.nav_data_overview.finance',
                        ),
                        path: accountingPaths.company.finance,
                        icon: navIcon.finance,
                        children: [
                            {
                                title: t(
                                    'nav_data.nav_company_config.nav_data_overview.finance_booking',
                                ),
                                path: accountingPaths.company.financeBooking,
                            },
                            {
                                title: t(
                                    'nav_data.nav_company_config.nav_data_overview.finance_journal',
                                ),
                                path: accountingPaths.company.financeJournal,
                            },
                            {
                                title: t(
                                    'nav_data.nav_company_config.nav_data_overview.finance_reports',
                                ),
                                path: accountingPaths.company.financeReports,
                            },
                        ],
                    },
                ],
            },
        ],
        [t],
    );

    return data;
};
