import { Box } from '@mui/material';

const Circle = ({ success }: { success: boolean }) => (
    <Box
        sx={{
            backgroundColor: (theme) =>
                success ? theme.palette.primary.main : theme.palette.error.main,
        }}
        width="8px"
        height="8px"
        borderRadius={(theme) => theme.shape.borderRadius('circle')}
        justifyContent="center"
        alignItems="center"
    />
);

export default Circle;
