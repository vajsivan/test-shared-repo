import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { SHOULD_SET_DIRTY_AND_VALIDATE } from 'src/constants';
import { DefaultValue } from 'src/types';

export const useRHFClearValue = <TOption>(
    name: string,
    defaultValue: DefaultValue<TOption>,
    onClear?: () => void,
) => {
    const { setValue } = useFormContext();

    const isValueCleared = useRef(false);

    useEffect(() => {
        isValueCleared.current = false;
    }, [defaultValue]);

    const clearHandler = () => {
        isValueCleared.current = true;
        setValue(name, null, SHOULD_SET_DIRTY_AND_VALIDATE);
        onClear?.();
    };

    return { clearHandler, isValueCleared: isValueCleared.current };
};
