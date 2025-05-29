import {
    Button,
    Dialog,
    DialogContent,
    Stack,
    Typography,
} from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
    RevertIllustration,
    UnmatchIllustration,
} from 'src/assets/illustrations';
import { pxToRem } from 'src/theme/typography';

type Props = {
    isOpen: boolean;
    onClose: VoidFunction;
    callback: VoidFunction;
    title?: string;
    description?: string;
    type: 'reversal' | 'unmatch';
};

export const ReversalUnmatchConfirmationDialog: FC<Props> = ({
    isOpen,
    onClose,
    callback,
    title,
    description,
    type,
}) => {
    const { t } = useTranslation();

    return (
        <Dialog
            id="select-provider-step-2"
            open={isOpen}
            onClose={onClose}
            sx={{
                '& .MuiDialog-paper': {
                    width: pxToRem(980),
                },
            }}
        >
            <DialogContent>
                <Stack alignItems="center" gap={5}>
                    <Stack maxWidth={500} gap={1}>
                        <Stack py={5} alignItems="center">
                            {type === 'reversal' ? (
                                <RevertIllustration />
                            ) : (
                                <UnmatchIllustration />
                            )}
                        </Stack>
                        <Typography
                            mt={3}
                            fontSize={24}
                            fontWeight={(theme) =>
                                theme.typography.fontWeightBold
                            }
                            variant="h2"
                            textAlign="center"
                        >
                            {title || t('crm.payments.revert_record')}
                        </Typography>

                        <Typography
                            fontSize={14}
                            textAlign="center"
                            color={(theme) => theme.palette.grey[600]}
                        >
                            {description ||
                                t('crm.payments.revert_record_confirmation')}
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={3}
                    >
                        <Button onClick={onClose} variant="secondary">
                            {t('general.cancel_button')}
                        </Button>
                        <Button onClick={callback} variant="primary">
                            {t('general.confirm')}
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};
