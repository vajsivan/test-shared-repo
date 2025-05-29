import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExpandableInput } from 'src/components/expandable-inputs';
import {
    Avatar,
    Box,
    debounce,
    MenuItem,
    Typography,
    useTheme,
} from '@mui/material';
import { Stack } from '@mui/system';
import { Company, User } from 'src/types';
import { Loader } from 'src/assets';
import { useGetCompanies } from 'src/services/companies/companies-queries/hooks/use-companies';
import RecentlyViewed from './recently-viewed';
import { useRecentlyViewedCompanies } from '../hooks';

interface Props {
    user: User;
    company: Company | null;
    onSelectCompany: (company: Company) => void;
}

export default function CompaniesSearch({
    user,
    company,
    onSelectCompany,
}: Props) {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState<string>('');
    const theme = useTheme();
    const { setRecentlyViewedCompany } = useRecentlyViewedCompanies(user);
    const [companySearch, setCompanySearch] = useState<string>('');
    const { companies, isLoadingGetCompanies } = useGetCompanies(
        {
            search: companySearch,
        },
        { enabled: !!companySearch },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedCompanyNameChangeHandler = useCallback(
        debounce((value: string) => {
            if (value.length > 2) {
                setCompanySearch(value);
            }
        }, 300),
        [],
    );

    useEffect(() => {
        debouncedCompanyNameChangeHandler(searchValue);
    }, [debouncedCompanyNameChangeHandler, searchValue]);

    const handleSelectCompany = (companyParam: Company) => {
        onSelectCompany(companyParam);
        setRecentlyViewedCompany(companyParam);
    };

    return (
        <Stack>
            <ExpandableInput
                onChange={setSearchValue}
                value={searchValue}
                initiallyOpen
            />

            <Stack pt={2}>
                {isLoadingGetCompanies && (
                    <Box>
                        <Loader />
                    </Box>
                )}
                {companies.map((cmp) => (
                    <MenuItem
                        key={cmp.id}
                        onClick={() => handleSelectCompany(cmp)}
                        sx={{ p: 0.5 }}
                    >
                        <Stack
                            flex="none"
                            justifyContent="center"
                            alignItems="center"
                            width={32}
                            height={32}
                            borderRadius={theme.shape.borderRadius('sm')}
                            mr={1.25}
                            sx={{ background: theme.palette.grey[100] }}
                        >
                            {cmp.logoUrl ? (
                                <Avatar
                                    src={cmp?.logoUrl}
                                    variant="rounded"
                                    sx={{ width: '32px', height: '32px' }}
                                    alt={cmp?.name}
                                />
                            ) : (
                                cmp.name?.charAt(0).toUpperCase()
                            )}
                        </Stack>
                        <Typography
                            variant="body2Bold"
                            display="block"
                            overflow="hidden"
                            textOverflow="ellipsis"
                        >
                            {cmp?.name}
                        </Typography>
                    </MenuItem>
                ))}

                {!searchValue.length && companies.length === 0 ? (
                    <Typography
                        px={0.5}
                        variant="body3Regular"
                        color="textSecondary"
                    >
                        {t('company.type_to_search')}
                    </Typography>
                ) : null}

                {!isLoadingGetCompanies &&
                    companies.length === 0 &&
                    searchValue.length > 2 && (
                        <Typography
                            px={0.5}
                            variant="body3Regular"
                            color="textSecondary"
                        >
                            {t('company.companies_not_found')}
                        </Typography>
                    )}
            </Stack>

            <RecentlyViewed
                user={user}
                company={company}
                onSelectCompany={onSelectCompany}
            />
        </Stack>
    );
}
