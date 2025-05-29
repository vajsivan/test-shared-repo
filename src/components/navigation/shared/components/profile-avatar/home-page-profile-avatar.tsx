import { Typography, useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { CaretIcon } from 'src/assets';
import { User } from 'src/types';

interface ProfileAvatarProps {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    open?: boolean;
    user?: User;
}

const HomePageProfileAvatar = ({ onClick, open, user }: ProfileAvatarProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    return (
        <Stack
            direction="row"
            alignItems="center"
            onClick={onClick}
            gap={1.25}
            p={0.5}
            pr={2}
            borderRadius={theme.shape.borderRadius('md')}
            sx={{ cursor: 'pointer', background: theme.palette.grey[100] }}
        >
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                height={40}
                width={40}
                sx={{ cursor: 'pointer', background: theme.palette.grey[100] }}
            >
                {user?.profileImageUrl ? (
                    <Avatar
                        src={user.profileImageUrl}
                        sx={{
                            width: '32px',
                            height: '32px',
                            borderRadius: theme.shape.borderRadius('sm'),
                        }}
                        alt={t('my_profile.avatar')}
                    />
                ) : (
                    user?.firstName?.charAt(0).toUpperCase()
                )}
            </Stack>
            <Typography variant="body2Regular">{user?.firstName}</Typography>
            <CaretIcon
                sx={{
                    transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                }}
            />
        </Stack>
    );
};

export default HomePageProfileAvatar;
