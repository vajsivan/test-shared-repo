import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
    ResponseErrorConfigCbWithParams,
    ToastConfig,
} from 'src/hooks/use-error-handler/types';
import { accountingPaths } from 'src/route';

export const useUploadFileResolveMapper = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const toastConfigMapper: ResponseErrorConfigCbWithParams = (response) => {
        const mapperReturn: ToastConfig[] = [];

        const documentIdsLength = response.documentIds?.length ?? 0;
        const issuesLength = response.issues?.length ?? 0;

        if (documentIdsLength > 0) {
            mapperReturn.push({
                title: t(
                    'company.documents.file_manager.toast_title_upload_file',
                    {
                        count: documentIdsLength,
                    },
                ),
                body: t(
                    'company.documents.file_manager.toast_description_upload_file',
                    {
                        count: documentIdsLength,
                    },
                ),
                severity: 'success',
            });
        }

        if (issuesLength > 0) {
            response?.issues?.forEach((issue) => {
                const referencesLength =
                    issue?.exception?.references?.length ?? 0;

                mapperReturn.push({
                    title: t('company.documents.file_manager.upload_failed'),
                    body: t(
                        `company.documents.file_manager.${issue.exception?.code}`,
                    ),
                    severity: 'error',
                    duration: referencesLength > 0 ? 10000 : undefined,
                    onCLick:
                        referencesLength > 0
                            ? () => {
                                  navigate(
                                      `${accountingPaths.company.file_manager}&fileIds=${issue.exception?.references?.[0].value}`,
                                  );
                              }
                            : undefined,
                    highlightedText: issue.documentName,
                });
            });
        }

        return mapperReturn;
    };

    return toastConfigMapper;
};
