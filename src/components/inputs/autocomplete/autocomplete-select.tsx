// @mui
import {
    Autocomplete,
    createFilterOptions,
    SxProps,
    Theme,
    Tooltip,
    TooltipProps,
} from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Key, useCallback } from 'react';

// ----------------------------------------------------------------------

type AutocompleteSelectProps = Omit<TextFieldProps, 'onChange'> & {
    sx?: SxProps<Theme>;
    name: string;
    native?: boolean;
    maxHeight?: boolean | number;
    options: any;
    disabled?: boolean;
    matchFrom?: 'start' | 'any' | 'custom';
    freeSolo?: boolean;
    autocompleteKey?: Key;
    onChange?: (value: string) => void;
    onSelectOption?: (value: string | null) => void;
    tooltip?: Omit<TooltipProps, 'children'>;
};

export function AutocompleteSelect({
    name,
    label,
    options,
    disabled,
    matchFrom = 'any',
    freeSolo = false,
    onChange,
    onSelectOption,
    value,
    autocompleteKey,
    sx,
    tooltip,
}: AutocompleteSelectProps) {
    const customFilterOptions = (
        avaliableOptions: any[],
        { inputValue }: any,
    ) => {
        if (!inputValue) {
            return avaliableOptions;
        }

        const startsWithNumber = /^\d/.test(inputValue);

        if (startsWithNumber) {
            return avaliableOptions.filter((option) =>
                option.label.startsWith(inputValue),
            );
        }
        return avaliableOptions.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase()),
        );
    };

    const filterOptions =
        matchFrom === 'custom'
            ? customFilterOptions
            : createFilterOptions({
                  matchFrom,
              });

    const getAutocompleteValue = useCallback(() => {
        const foundOption = options?.find(
            (option: any) => option.value === value,
        );

        if (foundOption) {
            return foundOption;
        }

        if (value) {
            return { value, label: value };
        }

        return null;
    }, [options, value]);

    return (
        <Autocomplete
            id="autocomplete-select"
            sx={sx}
            key={autocompleteKey}
            options={options}
            filterOptions={filterOptions}
            value={getAutocompleteValue()}
            onChange={(e, valueObj: any, reason) => {
                e.stopPropagation();
                if (reason === 'clear') {
                    if (onSelectOption) {
                        onSelectOption(null);
                    }
                    return;
                }

                if (onSelectOption) {
                    onSelectOption?.(valueObj.value);
                }
            }}
            renderInput={(params) => (
                <Tooltip
                    arrow
                    placement="right"
                    title={tooltip?.title}
                    {...tooltip}
                >
                    <TextField
                        name={name}
                        variant="filled"
                        {...params}
                        label={label}
                        onChange={(e) => {
                            e.stopPropagation();
                            if (onChange) {
                                onChange(e.target.value);
                            }
                        }}
                        value={value}
                    />
                </Tooltip>
            )}
            disabled={disabled}
            freeSolo={freeSolo}
        />
    );
}
