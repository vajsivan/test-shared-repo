import { Box, Stack } from '@mui/material';
import { ReactNode } from 'react';

export interface PaymentListItem {
    id: number;
    firstColumn: {
        label: ReactNode;
        id?: number;
    };
    secondColumn?: ReactNode;
    thirdColumn: ReactNode;
}

interface PayoffProgressListProps {
    paymentListItems: PaymentListItem[];
    onPaymentNameClick?: (id?: number) => void;
}

export const PayoffProgressList = ({
    paymentListItems,
    onPaymentNameClick,
}: PayoffProgressListProps) => (
    <Stack gap={2}>
        {paymentListItems.map((item, index) => (
            <Stack
                key={index}
                direction="row"
                justifyContent="space-evenly"
                gap={2}
                sx={{
                    '& > *': {
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                    },
                }}
            >
                <Box
                    sx={{ flex: 1 }}
                    onClick={() => onPaymentNameClick?.(item.firstColumn.id)}
                >
                    {item.firstColumn.label}
                </Box>
                <Box sx={{ flex: 1 }} textAlign="center">
                    {item.secondColumn}
                </Box>
                <Box sx={{ flex: 1 }} textAlign="right">
                    {item.thirdColumn}
                </Box>
            </Stack>
        ))}
    </Stack>
);
