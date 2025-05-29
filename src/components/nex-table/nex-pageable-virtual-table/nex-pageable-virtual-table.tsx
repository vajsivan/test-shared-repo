import { Stack } from '@mui/material';
import { forwardRef, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { usePropsGracefully } from 'src/hooks';
import { NexTableStyled } from '../styled/nex-table-styled';
import {
    NexPageableVirtualTableBody,
    NexPageableVirtualTableFooter,
    NexPageableVirtualTableHeader,
} from './components';
import { NexPageableVirtualTableProps } from './types';

function NexPageableVirtualTableInner<TData>(
    {
        sx,
        table,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        renderBody,
        renderExpandedRow,
        renderHeader,
        components,
    }: NexPageableVirtualTableProps<TData>,
    ref: React.Ref<HTMLDivElement>,
) {
    const { ref: endOfTableRef, inView } = useInView();

    const renderExpendedRowRef = usePropsGracefully(renderExpandedRow);

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage?.();
        }
    }, [fetchNextPage, hasNextPage, inView]);

    const NexTable = useMemo(
        () => components?.Table ?? NexTableStyled,
        [components?.Table],
    );

    return (
        <Stack
            ref={ref}
            sx={{
                overflow: 'auto',
                position: 'relative', // needed for sticky header
                ...sx,
            }}
        >
            <NexTable>
                {renderHeader ? (
                    renderHeader(table.getHeaderGroups())
                ) : (
                    <NexPageableVirtualTableHeader
                        table={table}
                        components={components}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                )}

                {renderBody ? (
                    renderBody(table.getRowModel())
                ) : (
                    <NexPageableVirtualTableBody
                        table={table}
                        components={components}
                        renderExpendedRowRef={renderExpendedRowRef}
                        endOfTableRef={endOfTableRef}
                    />
                )}

                <NexPageableVirtualTableFooter
                    table={table}
                    components={components}
                />
            </NexTable>
        </Stack>
    );
}

export const NexPageableVirtualTable = forwardRef(
    NexPageableVirtualTableInner,
) as <T>(
    props: NexPageableVirtualTableProps<T> & {
        ref?: React.ForwardedRef<HTMLDivElement | null>;
    },
) => ReturnType<typeof NexPageableVirtualTableInner>;
