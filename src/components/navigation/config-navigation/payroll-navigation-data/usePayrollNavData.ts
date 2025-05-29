import { useMemo } from 'react';
import { payrollPaths } from 'src/route';
import { useTranslation } from 'react-i18next';
import { NavListProps } from '../../types';
import { navIcon } from '../../utils';

export const usePayrollNavData = (): {
    subheader: string;
    items: NavListProps[];
}[] => {
    const { t } = useTranslation();
    const data = useMemo(
        () => [
            {
                subheader: t('payroll.pages.overview'),
                items: [
                    {
                        title: t('payroll.pages.payroll'),
                        path: payrollPaths.payroll.root,
                        icon: navIcon.payroll,
                    },

                    {
                        title: t('payroll.pages.employees'),
                        path: payrollPaths.payroll.employees.root,
                        icon: navIcon.employees,
                    },

                    {
                        title: t('payroll.pages.company'),
                        path: payrollPaths.payroll.company,
                        icon: navIcon.companyInfo,
                        children: [
                            {
                                title: t('payroll.pages.company_details'),
                                path: payrollPaths.payroll.companyDetails,
                            },
                            {
                                title: t('payroll.pages.insurances'),
                                path: payrollPaths.payroll.insurances,
                            },
                        ],
                    },

                    {
                        title: t('payroll.pages.report'),
                        path: payrollPaths.payroll.report,
                        icon: navIcon.report,
                    },
                ],
            },
        ],
        [t],
    );

    return data;
};
