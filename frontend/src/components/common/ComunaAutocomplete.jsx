import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import comunasData from '../../assets/comunas.json';

export const ComunaAutocomplete = ({ value, onChange, error, helperText }) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [inputValue, setInputValue] = useState(value || '');

  const filterComunas = (query) => {
    if (!query) {
      setFilteredOptions([]);
      return;
    }

    const matches = comunasData
      .filter((comuna) =>
        comuna.nombre.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10)
      .map((item) => ({ label: item.nombre, full: item }));

    setFilteredOptions(matches);
  };

  const debouncedFilter = useMemo(() => debounce(filterComunas, 300), []);

  useEffect(() => {
    debouncedFilter(inputValue);
  }, [inputValue, debouncedFilter]);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  return (
    <Autocomplete
      freeSolo
      fullWidth
      options={filteredOptions}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.label
      }
      value={value}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      onChange={(_, newValue) => {
        onChange(typeof newValue === 'string' ? newValue : newValue?.label || '');
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Comuna"
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
};
