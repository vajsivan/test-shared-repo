import { getCoreRowModel } from '@tanstack/react-table';
import { useNexReactTable } from 'src/components/nex-table';
import { InvoicePayment } from 'src/types';
import { useExtendedPaymentsTableColumns } from './use-extended-payments-table-columns';

export const useExtendedRowTable = (
    data: InvoicePayment[],
    columns: ReturnType<typeof useExtendedPaymentsTableColumns>,
) => {
    const table = useNexReactTable({
        options: {
            data,
            columns,
            getCoreRowModel: getCoreRowModel(),
        },
    });

    return {
        table,
    } as const;
};
