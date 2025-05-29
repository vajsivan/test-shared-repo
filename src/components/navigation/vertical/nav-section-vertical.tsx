import { memo } from 'react';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';

import { NavSectionProps, NavListProps, NavConfigProps } from '../types';
import { navVerticalConfig } from '../config';
import { StyledSubheader } from './styles';

import NavList from './nav-list';

function NavSectionVertical({ data, config, sx, ...other }: NavSectionProps) {
    return (
        <Stack sx={sx} {...other}>
            {data &&
                data.map((group, index) => (
                    <Group
                        key={group.subheader || index}
                        subheader={group.subheader}
                        items={group.items}
                        config={navVerticalConfig(config)}
                    />
                ))}
        </Stack>
    );
}

export default memo(NavSectionVertical);

type GroupProps = {
    subheader: string;
    items: NavListProps[];
    config: NavConfigProps;
};

function Group({ subheader, items, config }: GroupProps) {
    const renderContent = items.map((list) => (
        <NavList
            key={list.title + list.path}
            data={list}
            depth={1}
            hasChild={!!list.children}
            config={config}
        />
    ));

    return (
        <List disablePadding>
            {subheader ? (
                <>
                    <StyledSubheader config={config}>
                        {subheader}
                    </StyledSubheader>
                    {renderContent}
                </>
            ) : (
                renderContent
            )}
        </List>
    );
}
