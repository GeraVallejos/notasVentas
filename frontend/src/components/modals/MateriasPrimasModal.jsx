
import { useEffect, useState } from "react";
import * as yup from "yup";
import { api } from "../../utils/api";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formatearRut } from "../../utils/formatearRut";
import SearchSelect from "../common/SearchSelect";
import { parse } from "date-fns";

const schema = yup.object().shape({
    producto: yup.string().required("Selecciona un producto"),
    cantidad: yup.number()
        .typeError("Debe ser un número")
        .positive("Debe ser mayor a 0")
        .required("Campo obligatorio"),
    observacion: yup.string().nullable(),
});

const MateriasPrimasModal = ({ open, onClose, pedido, onUpdated }) => {


    const { enqueueSnackbar } = useSnackbar();
    const [saving, setSaving] = useState(false);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {

            rut_proveedor: "",
            nombre_proveedor: "",
            producto: null,
            cantidad: 0,
            unidad_medida: "",
            fecha_entrega: null,
            fecha_creacion: "",
            fecha_modificacion: "",
            estado: "",
            observacion: "",
        },
    });

    const transformMayus = (obj, excluir = []) => {
        const nuevoObj = { ...obj };
        for (const key in nuevoObj) {
            if (typeof nuevoObj[key] === 'string' && !excluir.includes(key)) {
                nuevoObj[key] = nuevoObj[key].toUpperCase();
            }
        }
        return nuevoObj;
    };

    // Reset al abrir modal
    useEffect(() => {

        

        const fechaEntrega =
            pedido.fecha_entrega
                ? parse(pedido.fecha_entrega, 'dd/MM/yyyy', new Date())
                : null;

        reset({
            producto: pedido.nombre_producto || null,
            cantidad: pedido.cantidad || 0,
            rut_proveedor: pedido.rut_proveedor || "",
            nombre_proveedor: pedido.nombre_proveedor || "",
            id_producto: pedido.id_producto|| null,
            unidad_medida: pedido.unidad_medida || "",
            fecha_entrega: fechaEntrega || null,
            observacion: pedido.observacion || "",
        });

    }, [pedido, reset]);


    console.log(pedido)

    const handleChangeRut = (e) => {
        const rawValue = e.target.value;
        const formattedValue = formatearRut(rawValue);
        setValue('rut_proveedor', formattedValue, { shouldValidate: true });
    };

    const handleBlurRut = async (e) => {
        const rutFormateado = e.target.value?.trim();

        // Si no hay valor o es solo espacios, no hace nada
        if (!rutFormateado) return;

        try {
            const { data } = await api.get('/proveedores/por-rut/', {
                params: { rut: rutFormateado },
            });

            setValue('rut_proveedor', data.rut_proveedor || '');
            setValue('nombre_proveedor', data.razon_social || '');
            setValue('id_proveedor', data.id_proveedor || '');

        } catch (error) {
            console.error(error);
            setValue('rut_proveedor', '');
            setValue('nombre_proveedor', '');
            setValue('id_proveedor', '');
            enqueueSnackbar('Proveedor no encontrado', { variant: 'warning' });
        }
    };

    // Guardar cambios
    const onSubmit = async (data) => {
        if (!pedido?.id_pedido) return;
        console.log(data)

        const payload = {
            id_producto: data.id_producto,
            cantidad: data.cantidad,
            rut_proveedor: data.rut_proveedor,
            nombre_proveedor: data.nombre_proveedor,
            unidad_medida: data.unidad_medida,
            fecha_entrega: data.fecha_entrega,
            observacion: data.observacion
        };

        try {
            setSaving(true);
            await api.patch(`/pedido_materias_primas/${pedido.id_pedido}/`, transformMayus(payload));
            enqueueSnackbar("Pedido actualizado con éxito", { variant: "success" });
            onUpdated();
            onClose();
        } catch (error) {
            console.error("Error al actualizar el pedido:", error);
            enqueueSnackbar("Error al actualizar el pedido", { variant: "error" });
        } finally {
            setSaving(false);
        }

    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Editar Pedido de Materia Prima</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="rut_proveedor"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Rut proveedor"
                                    autoCorrect="off"
                                    autoComplete="off"
                                    fullWidth
                                    onChange={handleChangeRut}
                                    onBlur={handleBlurRut}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    InputLabelProps={{
                                        shrink: !!field.value
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <SearchSelect
                            name="nombre_proveedor"
                            control={control}
                            label="Razón Social"
                            endpoint="/pedido_materias_primas/buscar-proveedores"
                            getOptionLabel={(option) =>
                                typeof option === "string" ? option : option.razon_social
                            }
                            onSelect={(value) => {
                                if (value) {
                                    setValue("rut_proveedor", value.rut_proveedor);
                                    setValue("id_proveedor", value.id_proveedor);
                                } else {
                                    setValue("rut_proveedor", "");
                                    setValue("id_proveedor", "");
                                }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }}>
                        <SearchSelect
                            name="producto"
                            control={control}
                            label="Producto"
                            endpoint="/pedido_materias_primas/buscar-productos"
                            getOptionLabel={(option) =>
                                typeof option === "string" ? option : option.nombre
                            }
                            onSelect={(value) => {
                                if (value) {
                                    setValue("codigo", value.codigo);
                                    setValue("unidad_medida", value.unidad_medida);
                                    setValue("id_producto", value.id_producto);
                                } else {
                                    setValue("codigo", "");
                                    setValue("unidad_medida", "");
                                    setValue("id_producto", "");
                                }
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="cantidad"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Cantidad"
                                    type="number"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="unidad_medida"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Unidad de Medida"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="observacion"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Observación"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    fullWidth
                                    multiline
                                    minRows={1}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="fecha_entrega"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    label="Fecha Entrega"
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: 'small',
                                            error: !!errors.fecha_entrega,
                                            helperText: errors.fecha_entrega?.message,
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={saving}>Cancelar</Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={saving}
                    variant="contained"
                    color="primary"
                    startIcon={saving ? <CircularProgress size={20} /> : null}
                >
                    {saving ? 'Guardando...' : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MateriasPrimasModal