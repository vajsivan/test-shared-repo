import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { User } from 'src/types';

interface ProfileAvatarProps {
    user?: User;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const ProfileAvatar = ({ user, onClick }: ProfileAvatarProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            height={40}
            width={40}
            borderRadius={theme.shape.borderRadius('md')}
            onClick={onClick}
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
    );
};

export default ProfileAvatar;
