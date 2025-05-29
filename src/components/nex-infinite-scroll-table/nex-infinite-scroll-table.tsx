import {
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Table,
} from '@mui/material';
import { FC, useEffect, Children, cloneElement, ReactElement } from 'react';
import { Props } from 'react-apexcharts';
import { useOnScreen } from 'src/hooks';
import { EmptyTableRows, NexTableHead } from '../table';
import { NexDataLoader } from '../loading-indicators';

export const NexInfiniteScrollTable: FC<Props> = ({
    rows,
    tableHead,
    tableTitles,
    tableData,
    isLoading,
    fetchCallback,
    hasMoreElements,
}) => {
    const { observerRef, isIntersecting } = useOnScreen({
        threshold: 0.5,
    });

    useEffect(() => {
        if (isIntersecting && !isLoading && hasMoreElements()) {
            fetchCallback();
        }
    }, [isIntersecting, isLoading, fetchCallback, hasMoreElements]);

    if (tableData.length === 0 && !isLoading) {
        return (
            <Table>
                <TableBody>
                    <EmptyTableRows
                        rowCount={10}
                        tableColSpan={tableTitles.length + 1}
                        tableDataLength={tableData.length}
                    />
                </TableBody>
            </Table>
        );
    }

    return (
        <Table stickyHeader>
            <TableHead>
                {tableHead || <NexTableHead headLabel={tableTitles} />}
            </TableHead>

            <TableBody sx={{ pt: 0 }}>
                {Children.map(rows, (row, index) =>
                    cloneElement(row as ReactElement, {
                        ref:
                            index === tableData.length - 1
                                ? observerRef
                                : undefined,
                    }),
                )}
                {isLoading && (
                    <TableRow data-testid="loader">
                        <TableCell colSpan={tableTitles.length}>
                            <NexDataLoader />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
