import { useFormContext, Controller } from 'react-hook-form';
// @mui
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup';
import { Stack } from '@mui/material';

// ----------------------------------------------------------------------

type Props = RadioGroupProps & {
    name: string;
    options: {
        icon: any;
        label: string;
        value: any;
    }[];
    label?: string;
    spacing?: number;
    helperText?: React.ReactNode;
};

export const RHFRadioGroup = ({
    row,
    name,
    label,
    options,
    spacing,
    helperText,
    ...other
}: Props) => {
    const { control } = useFormContext();

    const labelledby = label ? `${name}-${label}` : '';

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <FormControl component="fieldset">
                    {label && (
                        <FormLabel
                            component="legend"
                            id={labelledby}
                            sx={{ typography: 'body2' }}
                        >
                            {label}
                        </FormLabel>
                    )}

                    <RadioGroup
                        {...field}
                        aria-labelledby={labelledby}
                        row={row}
                        {...other}
                    >
                        {options.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio />}
                                label={
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={2}
                                    >
                                        {option.icon}
                                        {option.label}
                                        {/* Render the icon if it exists */}
                                    </Stack>
                                }
                                sx={{
                                    '&:not(:last-of-type)': {
                                        mb: spacing || 0,
                                    },
                                    ...(row && {
                                        mr: 0,
                                        '&:not(:last-of-type)': {
                                            mr: spacing || 2,
                                        },
                                    }),
                                }}
                            />
                        ))}
                    </RadioGroup>

                    {(!!error || helperText) && (
                        <FormHelperText error={!!error} sx={{ mx: 0 }}>
                            {error ? error?.message : helperText}
                        </FormHelperText>
                    )}
                </FormControl>
            )}
        />
    );
};
