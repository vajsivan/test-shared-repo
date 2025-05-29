import { Grid } from '@mui/material';
import { TextTruncation } from 'src/components/text';
import { MatchedPaymentResponse } from 'src/services';

interface Props {
    row: MatchedPaymentResponse;
    currency: string;
}

export const MatchedPaymentRow = ({ row, currency }: Props) => (
    <Grid
        container
        bgcolor={(theme) => theme.palette.grey[50]}
        borderRadius={(theme) => theme.shape.borderRadius('sm')}
        p={2}
    >
        <Grid xs={4} item>
            <TextTruncation>{row.contactName}</TextTruncation>
        </Grid>
        <Grid xs={3} item>
            <TextTruncation> {row.title} </TextTruncation>
        </Grid>
        <Grid xs={2} item>
            <TextTruncation sx={{ textAlign: 'center' }}>
                {row.paymentDate?.toNexDateFormatted() ?? '-'}
            </TextTruncation>
        </Grid>
        <Grid xs={3} item>
            <TextTruncation sx={{ textAlign: 'right' }}>
                {row.amount?.toNexCurrencyFormatted(currency) ?? '-'}
            </TextTruncation>
        </Grid>
    </Grid>
);
