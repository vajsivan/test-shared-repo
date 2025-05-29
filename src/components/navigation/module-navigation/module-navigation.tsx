import { Box, Color, IconButton, Stack } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { accountingPaths, bankPaths, crmPaths, payrollPaths } from 'src/route';
import {
    CollapsedIconNavigation,
    ExpandedIconNavigation,
    ModuleAccountingIcon,
    ModuleBankIcon,
    ModuleCRMIcon,
    ModulePayrollIcon,
} from 'src/assets';
import { ModuleNavigationLook, useAppSettingsStore } from 'src/store/settings';
import ModuleNavItem from './module-nav-item';

const ModuleNavigation = () => {
    const { t } = useTranslation();
    const { moduleDrawerState, moduleDrawerToggleView } = useAppSettingsStore();
    const isCollapsed = moduleDrawerState === ModuleNavigationLook.COLLAPSED;
    const isHidden = moduleDrawerState === ModuleNavigationLook.HIDDEN;

    return (
        !isHidden && (
            <Stack
                sx={{
                    minHeight: 1,
                    flexDirection: 'row',
                }}
            >
                <Stack
                    component="nav"
                    sx={{
                        width: isCollapsed ? 'unset' : 206,
                        p: 2,
                        gap: 2,
                        position: 'relative',
                        zIndex: 2,
                        backgroundColor: (theme) =>
                            (theme.palette.grey as Color)[850],
                        boxShadow:
                            '0px 4px 6px 0px #0F172A0D, 0px 10px 15px -3px #0F172A12',
                    }}
                >
                    <ModuleNavItem
                        icon={ModuleAccountingIcon}
                        path={accountingPaths.company.root}
                        content={t('nav_data.module_navigation.accounting')}
                    />
                    <ModuleNavItem
                        icon={ModulePayrollIcon}
                        path={payrollPaths.payroll.root}
                        content={t('nav_data.module_navigation.payroll')}
                    />

                    {process.env.ENABLE_CRM && (
                        <ModuleNavItem
                            icon={ModuleCRMIcon}
                            path={crmPaths.root}
                            content={t('nav_data.module_navigation.crm')}
                        />
                    )}

                    {process.env.ENABLE_BANK && (
                        <ModuleNavItem
                            icon={ModuleBankIcon}
                            path={bankPaths.bank.root}
                            content={t('nav_data.module_navigation.bank')}
                        />
                    )}

                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton
                        sx={{
                            alignSelf: isCollapsed ? 'center' : 'flex-start',
                        }}
                        size="small"
                        onClick={() => moduleDrawerToggleView(!isCollapsed)}
                    >
                        {isCollapsed ? (
                            <CollapsedIconNavigation />
                        ) : (
                            <ExpandedIconNavigation />
                        )}
                    </IconButton>
                </Stack>
            </Stack>
        )
    );
};

export default ModuleNavigation;
