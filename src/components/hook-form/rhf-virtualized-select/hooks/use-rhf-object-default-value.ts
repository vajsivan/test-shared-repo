import { DefaultValue } from 'src/types';

import { useFormContext, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { isEqual } from 'lodash';
import { SHOULD_SET_DIRTY_AND_VALIDATE } from 'src/constants';

export const useRHFObjectDefaultValue = <TOption>(
    name: string,
    defaultValue?: DefaultValue<TOption>,
) => {
    const { control, setValue } = useFormContext();

    const value = useWatch({ control, name });

    useEffect(() => {
        if (!isEqual(value, defaultValue) && typeof defaultValue === 'object') {
            setValue(name, defaultValue, SHOULD_SET_DIRTY_AND_VALIDATE);
        }
    }, [defaultValue, name, setValue, value]);
};
