import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { SHOULD_SET_DIRTY_AND_VALIDATE } from 'src/constants';
import {
    DefaultFactoryParams,
    DefaultValue,
    QueryFactoryObjectArgs,
} from 'src/types';

export const useRHFPrimitiveDefaultValue = <TData, TOption>(
    name: string,
    selectionByProperty: keyof TOption,
    defaultValueQueryFactory?: QueryFactoryObjectArgs<TData>,
    optionMapper?: (data: TData) => TOption,
    defaultValue?: DefaultValue<TOption>,
    isValueCleared?: boolean,
) => {
    const { control, setValue } = useFormContext();

    const value = useWatch({ control, name });

    const queryParams = useMemo(
        () => ({
            [selectionByProperty]: defaultValue,
        }),
        [defaultValue, selectionByProperty],
    ) as DefaultFactoryParams;

    const { data, isLoading, refetch } = useQuery({
        ...defaultValueQueryFactory?.(queryParams),
        enabled:
            !!defaultValue &&
            typeof defaultValue !== 'object' &&
            !!defaultValueQueryFactory,
    } as UseQueryOptions<TData>);

    const dataMapped = useMemo(() => {
        if (data) {
            return optionMapper ? optionMapper(data) : (data as TOption);
        }
        return null;
    }, [data, optionMapper]);

    useEffect(() => {
        if (
            !value &&
            typeof defaultValue !== 'object' &&
            defaultValueQueryFactory &&
            !isValueCleared
        ) {
            refetch().then(() => {
                if (dataMapped) {
                    setValue(name, dataMapped, SHOULD_SET_DIRTY_AND_VALIDATE);
                }
            });
        }
    }, [
        dataMapped,
        defaultValue,
        defaultValueQueryFactory,
        name,
        refetch,
        setValue,
        value,
        isValueCleared,
    ]);

    return {
        isLoadingDefaultValue: isLoading,
    } as const;
};
