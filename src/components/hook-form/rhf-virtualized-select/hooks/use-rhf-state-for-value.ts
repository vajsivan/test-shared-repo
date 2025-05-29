import { DefaultValue, QueryFactoryObjectArgs } from 'src/types';
import { useRHFClearValue } from './use-rhf-clear-value';
import { useRHFPrimitiveDefaultValue } from './use-rhf-primitive-default-value';
import { useRHFObjectDefaultValue } from './use-rhf-object-default-value';

export const useRHFStateForValue = <TData, TOption = TData>(
    name: string,
    selectionByProperty: keyof TOption,
    defaultValueQueryFactory?: QueryFactoryObjectArgs<TData>,
    optionMapper?: (data: TData) => TOption,
    defaultValue?: DefaultValue<TOption>,
    onClear?: () => void,
) => {
    const { clearHandler, isValueCleared } = useRHFClearValue(
        name,
        defaultValue,
        onClear,
    );

    const { isLoadingDefaultValue } = useRHFPrimitiveDefaultValue(
        name,
        selectionByProperty,
        defaultValueQueryFactory,
        optionMapper,
        defaultValue,
        isValueCleared,
    );

    useRHFObjectDefaultValue(name, defaultValue);

    return {
        isLoadingDefaultValue,
        clearHandler,
    } as const;
};
