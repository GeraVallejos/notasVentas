import { Autocomplete, TextField } from "@mui/material";
import { useState, useMemo } from "react";
import { Controller } from "react-hook-form";
import { api } from "../../utils/api";
import { debounce } from "lodash";

const SearchSelect = ({
    name,
    control,
    label,
    endpoint,       // ej: "/proveedores/buscar/"
    getOptionLabel, // cómo mostrar la opción
    onSelect,       // callback cuando seleccionas un item
    debounceTime = 400,
}) => {
    const [options, setOptions] = useState([]);

    const fetchOptions = async (texto) => {
        if (!texto) {
            setOptions([]);
            return;
        }
        try {
            const { data } = await api.get(endpoint, { params: { q: texto } });
            setOptions(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Memoizamos el debounce para que no se regenere en cada render
    const debouncedFetch = useMemo(
        () => debounce(fetchOptions, debounceTime),
        [endpoint, debounceTime]
    );

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Autocomplete
                    freeSolo
                    options={options}
                    getOptionLabel={getOptionLabel}
                    value={null} // no usamos objetos como valor, solo texto
                    inputValue={field.value || ""} // 🔹 conecta el texto al form
                    onInputChange={(e, newInputValue) => {
                        field.onChange(newInputValue); // 🔹 actualiza RHF con el texto
                        debouncedFetch(newInputValue);
                    }}
                    onChange={(e, value) => {
                        // cuando seleccionas de la lista
                        const stringValue = value ? getOptionLabel(value) : "";
                        field.onChange(stringValue);

                        if (onSelect) onSelect(value, field);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />
            )}
        />
    );
};

export default SearchSelect;
