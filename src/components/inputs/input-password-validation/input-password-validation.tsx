import {
    FormHelperText,
    Stack,
    SxProps,
    Theme,
    Typography,
} from '@mui/material';
import { t } from 'i18next';
import { RhfPasswordInput } from 'src/components/hook-form';
import {
    hasDigit,
    hasLowerAndUpperCase,
    hasSymbol,
    lengthAboveMinCh,
} from 'src/utils/validatons';
import Circle from './components/circle';

interface Props {
    watchPassword: string;
    sx?: SxProps<Theme>;
}

const InputPasswordValidation = ({ watchPassword, sx }: Props) => (
    <Stack sx={sx}>
        <RhfPasswordInput name="password" label={t('labels.password_label')} />

        {!!watchPassword && (
            <FormHelperText
                sx={{
                    color: (theme) => `${theme.palette.grey[900]} !important`,
                    mt: '15px',
                }}
            >
                <Stack
                    sx={{
                        gap: 1,
                        justifyContent: 'center',
                    }}
                >
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Circle success={lengthAboveMinCh(watchPassword, 8)} />

                        <Typography variant="body3Regular">
                            {t('password_validation.min_8_char')}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Circle success={hasDigit(watchPassword)} />

                        <Typography variant="body3Regular">
                            {t('password_validation.min_1_num')}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Circle success={hasSymbol(watchPassword)} />

                        <Typography variant="body3Regular">
                            {t('password_validation.min_1_sym')}
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Circle success={hasLowerAndUpperCase(watchPassword)} />

                        <Typography variant="body3Regular">
                            {t('password_validation.min_lowercase_uppercase')}
                        </Typography>
                    </Stack>
                </Stack>
            </FormHelperText>
        )}
    </Stack>
);

export default InputPasswordValidation;
