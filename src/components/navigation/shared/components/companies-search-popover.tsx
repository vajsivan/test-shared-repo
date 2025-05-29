import { Avatar, Stack, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import { CaretIcon } from 'src/assets';
import { NexPopover, usePopover } from 'src/components/nex-popover';
import { useCurrentModule } from 'src/hooks';
import { accountingPaths, bankPaths, crmPaths, payrollPaths } from 'src/route';
import { Company, Modules, User } from 'src/types';
import CompaniesSearch from './companies-search';

interface CompaniesSearchPopoverProps {
    isMiniNav?: boolean;
    user: User;
    company: Company | null;
}

const CompaniesSearchPopover = ({
    isMiniNav,
    user,
    company,
}: CompaniesSearchPopoverProps) => {
    const navigate = useNavigate();
    const popover = usePopover();
    const theme = useTheme();
    const module = useCurrentModule();

    const handleChooseCompany = (c: Company) => {
        let path = '';

        if (module === Modules.ACCOUNTING) {
            path = `${accountingPaths.company.dashboard}?tenantId=${c.id}`;
        }

        if (module === Modules.PAYROLL) {
            path = `${payrollPaths.payroll.companyDetails}?tenantId=${c.id}`;
        }
        if (module === Modules.CRM) {
            path = `${crmPaths.contacts.root}?tenantId=${c.id}`;
        }

        if (module === Modules.BANK) {
            path = `${bankPaths.bank.dashboard}?tenantId=${c.id}`;
        }

        navigate(path);
        popover.onClose();
    };

    return (
        <>
            <Stack
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="center"
                height={32}
                onClick={popover.onOpen}
                borderRadius={theme.shape.borderRadius('sm')}
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: theme.palette.grey[100],
                    },
                }}
            >
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    width={32}
                    height={32}
                    borderRadius={theme.shape.borderRadius('sm')}
                    sx={{ background: theme.palette.grey[100] }}
                >
                    {company?.logoUrl ? (
                        <Avatar
                            src={company?.logoUrl}
                            variant="rounded"
                            sx={{ width: '32px', height: '32px' }}
                            alt={company.name}
                        />
                    ) : (
                        company?.name?.charAt(0).toUpperCase()
                    )}
                </Stack>

                {!isMiniNav && (
                    <Stack
                        flexDirection="row"
                        width={1}
                        justifyContent="space-between"
                    >
                        <Typography variant="body2Regular" ml={1.25}>
                            {company?.name}
                        </Typography>
                        <CaretIcon
                            sx={{
                                transform: popover.open
                                    ? 'rotate(0deg)'
                                    : 'rotate(180deg)',
                                mr: 1.75,
                            }}
                        />
                    </Stack>
                )}
            </Stack>
            <NexPopover
                open={popover.open}
                onClose={popover.onClose}
                style={{ top: 0 }}
                arrowPlacement={isMiniNav ? 'right-center' : 'bottom-center'}
                hiddenArrow
                sx={{ width: 365, mt: 1 }}
            >
                <CompaniesSearch
                    user={user}
                    company={company}
                    onSelectCompany={handleChooseCompany}
                />
            </NexPopover>
        </>
    );
};

export default CompaniesSearchPopover;
