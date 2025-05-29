import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useActiveCompanyId = () => {
    const [searchParams] = useSearchParams();
    const tenantId = searchParams.get('tenantId');

    return useMemo(() => {
        let id = sessionStorage.getItem('tenantId');

        if (tenantId && tenantId !== id) {
            id = tenantId;
            sessionStorage.setItem('tenantId', tenantId);
        }

        return id;
    }, [tenantId]);
};
