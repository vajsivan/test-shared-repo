import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { accountingPaths } from 'src/route';
import { NavListProps } from '../../types';
import { navIcon } from '../../utils';

export const useAccountingNavDataSettings = (
    isMini: boolean,
): {
    subheader: string;
    items: NavListProps[];
}[] => {
    const { t } = useTranslation();
    const data = useMemo(
        () => [
            {
                subheader: isMini
                    ? ''
                    : t(
                          'nav_data.nav_company_config.nav_data_settings.subheader',
                      ),
                items: [
                    {
                        title: t(
                            'nav_data.nav_company_config.nav_data_settings.accounting',
                        ),
                        path: accountingPaths.company.accounting,
                        icon: navIcon.accounting,
                    },
                    {
                        title: t(
                            'nav_data.nav_company_config.nav_data_settings.company',
                        ),
                        path: accountingPaths.company.info,
                        icon: navIcon.companyInfo,
                    },
                    {
                        title: t(
                            'nav_data.nav_company_config.nav_data_settings.team_managment',
                        ),
                        path: accountingPaths.company.team,
                        icon: navIcon.teamManagement,
                    },
                    {
                        title: t('payroll.labels.bank_accounts'),
                        path: accountingPaths.company.bankAccounts,
                        icon: navIcon.bankAccounts,
                    },
                ],
            },
        ],
        [isMini, t],
    );

    return data;
};
