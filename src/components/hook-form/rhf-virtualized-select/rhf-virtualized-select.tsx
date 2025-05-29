import { Stack } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { usePopover } from 'src/components/nex-popover';

import { NexGenericSelect } from 'src/components/nex-generic-select/nex-generic-select';
import { NexPageableVirtualList } from 'src/components/nex-tab-lists/nex-pageable-virtual-list';
import { anchorOrigin } from 'src/components/nex-popover/utils';
import { useRQToastNotification } from 'src/hooks/use-rq-toast-notification';
import { useTranslation } from 'react-i18next';
import {
    VirtualizedInfinityQueryProps,
    CommonVirtualizedSelectProps,
    InfinityQueryOptions,
    VirtualizedQueryProps,
} from 'src/types';
import { useFormContext, useWatch } from 'react-hook-form';
import {
    SelectSearchInput,
    VirtualizedSelectListItem,
    VirtualizedSelectValue,
} from 'src/components/virtualized-select';
import { useRHFVirtualizedSelect } from './hooks';

export type RHFVirtualizedSelectProps<
    TData,
    TOption = TData,
    TParams = Record<string, unknown>,
> = VirtualizedInfinityQueryProps<TData, TOption, TParams> &
    VirtualizedQueryProps<TData, TOption> &
    CommonVirtualizedSelectProps<TData, TOption> & {
        name: string;
        hasClearButton?: boolean;
    };

export const RHFVirtualizedSelect = <
    TData,
    TOption = TData,
    TParams = Record<string, unknown>,
>({
    name,
    label,
    defaultValue,
    defaultValueQueryFactory,
    selectionByProperty,
    getSelectionLabel,
    fetchingErrorMessage = '',
    searchPlaceholder,
    onSelectHandler,
    onClear,
    renderValue,
    renderListItem,
    infinityQueryFactory,
    infinityQueryFactoryParams,
    infinityQueryOptions,
    optionMapper,
    hasClearButton = true,
    helperText,
    disabled,
    hasChevronIcon,
    arrowPlacement = 'bottom-center',
    sxListItem,
    sxList,
    sxButton,
    sxPopover,
    sx,
}: RHFVirtualizedSelectProps<TData, TOption, TParams>) => {
    const [isButtonFocused, setIsButtonFocused] = useState(false);
    const [isInfinityFetchingActivated, setIsInfinityFetchingActivated] =
        useState(false);

    const {
        control,
        formState: { errors },
    } = useFormContext();

    const value = useWatch({ control, name });

    const popover = usePopover();

    const { t } = useTranslation();

    const infinityQueryOptionsLocal = useMemo(
        () =>
            ({
                ...infinityQueryOptions,
                enabled:
                    !!isInfinityFetchingActivated ||
                    !!infinityQueryOptions?.enabled,
            }) as InfinityQueryOptions<TData>,
        [infinityQueryOptions, isInfinityFetchingActivated],
    );

    const error = errors[name];

    const {
        options,
        searchValue,
        onSearchChange,
        onSelect,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isError,
        isLoadingDefaultValue,
        isLoadingInfiniteQuery,
        clearHandler,
    } = useRHFVirtualizedSelect({
        name,
        defaultValue,
        selectionByProperty,
        defaultValueQueryFactory,
        infinityQueryFactory,
        infinityQueryFactoryParams,
        infinityQueryOptions: infinityQueryOptionsLocal,
        optionMapper,
        onClear,
    });

    useRQToastNotification(
        isError,
        t('crm.toast.error.title'),
        fetchingErrorMessage,
    );

    const handleListItemClick = useCallback(
        ({
            e,
            item,
        }: {
            e: React.MouseEvent<HTMLLIElement>;
            item: TOption;
        }) => {
            e.stopPropagation();

            onSelect(item);

            onSelectHandler?.({ e, selectedValue: item });

            popover.onClose();
        },
        [onSelectHandler, popover, onSelect],
    );

    const getIsSelected = useCallback(
        (item: TOption) => {
            let isSelected = false;

            if (!value) {
                return false;
            }

            if (selectionByProperty) {
                isSelected =
                    value[selectionByProperty] === item[selectionByProperty];
            } else {
                isSelected = value === item;
            }

            return isSelected;
        },
        [selectionByProperty, value],
    );

    const renderListItemHandler = useCallback(
        (item: TOption, index: number) => {
            if (!renderListItem) {
                return (
                    <VirtualizedSelectListItem
                        value={getSelectionLabel(item)}
                        isSelected={getIsSelected(item)}
                    />
                );
            }

            return renderListItem({
                item,
                index,
                isSelected: getIsSelected(item),
            });
        },
        [getIsSelected, getSelectionLabel, renderListItem],
    );

    const isInTopVerticalPosition =
        anchorOrigin[arrowPlacement].vertical === 'top';

    const renderValueHandler = useCallback(() => {
        if (!renderValue) {
            return (
                <VirtualizedSelectValue
                    label={label ?? ''}
                    value={getSelectionLabel(value)}
                    isButtonFocused={isButtonFocused}
                    isPopoverOpen={!!popover.open}
                />
            );
        }

        return renderValue({
            selectedItem: value,
            isPopoverOpen: !!popover.open,
            isButtonFocused,
        });
    }, [
        renderValue,
        value,
        popover.open,
        isButtonFocused,
        label,
        getSelectionLabel,
    ]);

    return (
        <NexGenericSelect
            sx={sx}
            sxButton={sxButton}
            sxPopover={sxPopover}
            value={renderValueHandler()}
            disabled={disabled}
            popover={popover}
            arrowPlacement={arrowPlacement}
            hasClearButton={hasClearButton && !!value}
            hasChevronIcon={hasChevronIcon}
            error={error}
            helperText={helperText}
            setIsButtonFocused={setIsButtonFocused}
            onClick={() => {
                setIsInfinityFetchingActivated(true);
            }}
            onClear={clearHandler}
        >
            <Stack
                gap={1}
                flexDirection={
                    isInTopVerticalPosition ? 'column-reverse' : 'column'
                }
            >
                <SelectSearchInput
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={onSearchChange}
                />

                <NexPageableVirtualList
                    isLoading={isLoadingDefaultValue || isLoadingInfiniteQuery}
                    items={options}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    renderListItem={renderListItemHandler}
                    onListItemClick={handleListItemClick}
                    sx={sxList}
                    sxListItem={sxListItem}
                />
            </Stack>
        </NexGenericSelect>
    );
};
