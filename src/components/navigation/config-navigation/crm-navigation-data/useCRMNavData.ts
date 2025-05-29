import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { crmPaths } from 'src/route';
import { NavListProps } from '../../types';
import { navIcon } from '../../utils';

export const useCRMNavData = (): {
    subheader: string;
    items: NavListProps[];
}[] => {
    const { t } = useTranslation();
    const data = useMemo(
        () => [
            {
                subheader: t('crm.pages.overview'),
                items: [
                    // {
                    //     title: t('crm.pages.dashboard'),
                    //     path: crmPaths.dashboard,
                    //     icon: navIcon.dashboard,
                    // },
                    {
                        title: t('crm.pages.contacts'),
                        path: crmPaths.contacts.root,
                        icon: navIcon.contacts,
                    },

                    {
                        title: t('crm.pages.sales'),
                        path: crmPaths.sales.root,
                        icon: navIcon.sales,
                    },
                    {
                        title: t('crm.pages.purchases'),
                        path: crmPaths.purchases,
                        icon: navIcon.purchases,
                    },
                    {
                        title: t('crm.pages.items'),
                        path: crmPaths.items,
                        icon: navIcon.items,
                    },
                    // {
                    //     title: t('crm.pages.conditions'),
                    //     path: crmPaths.conditions,
                    //     icon: navIcon.conditions,
                    // },
                    {
                        title: t('crm.pages.payment_terms'),
                        path: crmPaths.paymentTerms,
                        icon: navIcon.paymentTerms,
                    },
                ],
            },
        ],
        [t],
    );

    return data;
};
