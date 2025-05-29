import { InputAdornment } from '@mui/material';
import RHFTextField from './rhf-text-field';
import { RhfTextFieldWithStartAdornmentProps } from './types';

const RhfTextFieldWithStartAdornment = ({
    name,
    label,
    startAdornment,
    type,
    onBlur,
    maxDecimalPlaces = 2,
    ...others
}: RhfTextFieldWithStartAdornmentProps) => (
    <RHFTextField
        name={name}
        label={label}
        type={type}
        InputProps={{
            startAdornment: (
                <InputAdornment
                    position="start"
                    sx={{
                        '&.MuiInputAdornment-root': {
                            pt: '12px',
                        },
                    }}
                >
                    {startAdornment}
                </InputAdornment>
            ),
        }}
        maxDecimalPlaces={maxDecimalPlaces}
        onBlur={onBlur}
        {...others}
    />
);

export default RhfTextFieldWithStartAdornment;
