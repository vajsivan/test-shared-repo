import {
    useTheme,
    FormControlLabel,
    FormControlLabelProps,
    Radio,
    Typography,
} from '@mui/material';

interface RHFRadioButtonProps extends Omit<FormControlLabelProps, 'control'> {
    control?: FormControlLabelProps['control'];
}

export const RHFRadioButton = ({
    checked,
    label,
    value,
    control = <Radio />,
    ...props
}: RHFRadioButtonProps) => {
    const theme = useTheme();

    return (
        <FormControlLabel
            value={value}
            checked={checked}
            control={control}
            label={<Typography variant="body2Regular">{label}</Typography>}
            sx={{
                bgcolor: checked ? theme.palette.primary[20] : 'transparent',
                color: checked
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                borderRadius: theme.shape.borderRadius('sm'),
                paddingRight: 2,
                m: 0,
                '&.Mui-disabled': {
                    opacity: 0.5,
                    cursor: 'not-allowed',
                    '.MuiTypography-root': {
                        fontWeight: 500,
                        color: theme.palette.grey[700],
                    },
                    svg: {
                        color: theme.palette.grey[300],
                    },
                },
            }}
            {...props}
        />
    );
};
