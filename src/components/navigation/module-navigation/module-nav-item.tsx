import {
    Color,
    Link,
    ListItemButtonProps,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { RouterLink } from 'src/components/router-link';
import { useActiveLink } from 'src/hooks';
import { ModuleNavigationLook, useAppSettingsStore } from 'src/store/settings';

interface ModuleNavItemProps extends ListItemButtonProps {
    icon: JSX.Element['type'];
    path: string;
    content: string;
}

const ModuleNavItem = ({
    path,
    content,
    icon,

    ...rest
}: ModuleNavItemProps) => {
    const { moduleDrawerState } = useAppSettingsStore();
    const isCollapsed = moduleDrawerState === ModuleNavigationLook.COLLAPSED;

    const Icon = icon;

    const isActive = useActiveLink(path);

    return (
        <Link
            component={RouterLink}
            href={path}
            underline="none"
            sx={{
                padding: 2,
                borderRadius: (theme) => theme.shape.borderRadius('sm'),
                background: (theme) =>
                    isActive
                        ? theme.palette.common.white
                        : (theme.palette.grey as Color)[850],
            }}
            {...rest}
        >
            <Tooltip title={isCollapsed && content} arrow placement="right">
                <Stack flexDirection="row" gap={2}>
                    <Stack>
                        <Icon isActive={isActive} />
                    </Stack>

                    {!isCollapsed && (
                        <Typography
                            variant="button"
                            color={(theme) =>
                                isActive
                                    ? (theme.palette.grey as Color)[850]
                                    : theme.palette.common.white
                            }
                        >
                            {content}
                        </Typography>
                    )}
                </Stack>
            </Tooltip>
        </Link>
    );
};

export default ModuleNavItem;
