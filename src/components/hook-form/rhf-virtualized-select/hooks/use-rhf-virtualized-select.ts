import { useCallback } from 'react';
import { SHOULD_SET_DIRTY_AND_VALIDATE } from 'src/constants/rhf-config-options';
import {
    VirtualizedInfinityQueryProps,
    VirtualizedQueryProps,
} from 'src/types';
import { useFormContext } from 'react-hook-form';
import { useInfiniteQueryWithDebouncedSearch } from '../../../virtualized-select/hooks/use-infinite-query-with-debounced-search';
import { useSearchAndDebounce } from '../../../virtualized-select/hooks/use-search-and-debounce';
import { useRHFStateForValue } from './use-rhf-state-for-value';

export type UseRHFVirtualizedSelectProps<
    TData,
    TOption = TData,
    TParams = Record<string, unknown>,
> = VirtualizedInfinityQueryProps<TData, TOption, TParams> &
    VirtualizedQueryProps<TData, TOption> & {
        name: string;
        onClear?: () => void;
    };

export function useRHFVirtualizedSelect<
    TData,
    TOption = TData,
    TParams = Record<string, unknown>,
>({
    name,
    selectionByProperty,
    defaultValue,
    defaultValueQueryFactory,
    infinityQueryFactory,
    infinityQueryFactoryParams,
    infinityQueryOptions,
    optionMapper,
    onClear,
}: UseRHFVirtualizedSelectProps<TData, TOption, TParams>) {
    const { setValue } = useFormContext();

    const { isLoadingDefaultValue, clearHandler } = useRHFStateForValue(
        name,
        selectionByProperty,
        defaultValueQueryFactory,
        optionMapper,
        defaultValue,
        onClear,
    );

    const { searchValue, setSearchValue, debouncedSearchValue } =
        useSearchAndDebounce();

    const {
        options,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isLoading: isLoadingInfiniteQuery,
        isError,
        ...restOfInfiniteQueryHook
    } = useInfiniteQueryWithDebouncedSearch(
        debouncedSearchValue,
        infinityQueryFactory,
        infinityQueryFactoryParams,
        infinityQueryOptions,
        optionMapper,
    );

    const onSelect = useCallback(
        (selectedValue?: TOption) => {
            setValue(name, selectedValue, SHOULD_SET_DIRTY_AND_VALIDATE);
        },
        [name, setValue],
    );

    return {
        options,
        searchValue,
        onSearchChange: setSearchValue,
        onSelect,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isLoadingInfiniteQuery,
        isLoadingDefaultValue,
        isError,
        clearHandler,
        ...restOfInfiniteQueryHook,
    } as const;
}
