import { IconButton } from '@mui/material';
import { Row } from '@tanstack/react-table';
import { useTransition } from 'react';
import { ChevronIcon } from 'src/assets';

export const ChevronForExpendedRow = <TData,>({ row }: { row: Row<TData> }) => {
    const [, startTransition] = useTransition();

    const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        startTransition(() => {
            row.toggleExpanded(row.getIsExpanded() ? undefined : true);
        });
    };

    return (
        <IconButton
            sx={{
                borderRadius: '50%',
            }}
            onClick={onClickHandler}
        >
            <ChevronIcon
                sx={{
                    width: (theme) => theme.spacing(1.5),
                    height: (theme) => theme.spacing(1.5),
                    transform: row.getIsExpanded()
                        ? 'rotate(-90deg)'
                        : 'rotate(-180deg)',
                }}
            />
        </IconButton>
    );
};
