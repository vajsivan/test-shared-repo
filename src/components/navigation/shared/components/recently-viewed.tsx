import { Avatar, MenuItem, Stack, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Company, User } from 'src/types';
import { useRecentlyViewedCompanies } from '../hooks';

interface Props {
    user: User;
    company: Company | null;
    onSelectCompany: (company: Company) => void;
}

export default function RecentlyViewed({
    user,
    company,
    onSelectCompany,
}: Props) {
    const theme = useTheme();
    const { t } = useTranslation();
    const { getRecentlyViewedCompanies } = useRecentlyViewedCompanies(user);

    const recentlyViewedCompanies = getRecentlyViewedCompanies();

    let recentlyViewedCompaniesSlice: Company[] = [];

    if (!recentlyViewedCompanies || !recentlyViewedCompanies.length)
        return null;

    if (company) {
        recentlyViewedCompaniesSlice = recentlyViewedCompanies
            .filter((cmp) => cmp.id !== company.id)
            .slice(0, 5);
    }

    if (!recentlyViewedCompaniesSlice || !recentlyViewedCompaniesSlice.length)
        return null;

    return (
        <Stack pt={3} spacing={2}>
            <Typography px={0.5} variant="body3Regular" color="textSecondary">
                {t('company.recently_viewed')}
            </Typography>

            {recentlyViewedCompaniesSlice.map((cmp) => (
                <MenuItem
                    key={cmp.id}
                    onClick={() => onSelectCompany(cmp)}
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
        </Stack>
    );
}
