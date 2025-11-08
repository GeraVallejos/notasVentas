import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Grid, MenuItem, Stack, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { api } from '../../utils/api';
import { enqueueSnackbar } from 'notistack';
import SearchSelect from '../common/SearchSelect';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { format, parseISO } from 'date-fns';

const schema = (productosAgregados) =>
    yup.object().shape({
        nota: yup
            .mixed()
            .nullable()
            .notRequired(),
        producto: yup
            .mixed()
            .nullable()
            .notRequired(),
        cantidad: yup
            .number()
            .transform((value, originalValue) =>
                String(originalValue).trim() === '' ? null : value
            )
            .typeError('La cantidad debe ser un número')
            .positive('Debe ser mayor que cero')
            .integer('Debe ser entero')
            .nullable()
            .notRequired(),
        observacion: yup.string(),
        tipo: yup.string().test(
            "tipo-required",
            "Debe seleccionar un local",
            function (value) {
                const { nota } = this.parent;
                const tieneNota = nota && nota !== "";

                // Si existe nota válida, no exigir tipo
                if (tieneNota) return true;

                // Verificar que todos los productos tengan tipo si no hay nota
                const todosTienenTipo = productosAgregados?.every(
                    (p) => p.tipo && p.tipo !== ""
                );

                // Si no hay productos aún, también exigir tipo en el formulario
                if (!productosAgregados.length) {
                    return !!value;
                }

                // Si hay productos y alguno no tiene tipo → error
                return todosTienenTipo;
            }
        )
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

export const PickingForm = () => {
    const [loading, setLoading] = useState(false);
    const [productosAgregados, setProductosAgregados] = useState([]); // vista previa local
    const [notaValida, setNotaValida] = useState(true);

    const methods = useForm({
        resolver: yupResolver(schema(productosAgregados)),
        mode: 'onTouched',
        defaultValues: {
            nota: '',
            nota_id: null,
            razon_social_cliente: '',
            fecha_despacho: '',
            despacho_retira: '',
            tipo: '',
            producto: null,
            producto_id: null,
            cantidad: '',
            observacion: '',
        },
    });

    const { register, handleSubmit, resetField, control, setValue, getValues, formState: { errors } } = methods;


    const handleBlurNota = async (e) => {
        const nota = parseInt(e.target.value.trim());
        if (!nota) {
            // Si el campo queda vacío, limpiar los datos del cliente
            setValue("razon_social_cliente", "");
            setValue("fecha_despacho", "");
            setValue("despacho_retira", "");
            setValue("nota_id", null);
            setNotaValida(true);
            return;
        }

        try {
            const res = await api.get('/nota/cliente_por_nota/', { params: { nota } });

            const fechaDespacho = res.data.fecha_despacho
                ? format(parseISO(res.data.fecha_despacho), 'dd/MM/yyyy')
                : '';
            setValue('razon_social_cliente', res.data.razon_social || '');
            setValue('fecha_despacho', fechaDespacho || '');
            setValue('despacho_retira', res.data.despacho_retira || '');
            setValue('nota_id', res.data.nota_id || null);
            setNotaValida(true);
        } catch (error) {
            console.error('Error al buscar la nota:', error);
            enqueueSnackbar('No existe esa nota de venta', { variant: 'error' });
            setValue('razon_social_cliente', '');
            setValue('fecha_despacho', '');
            setValue('despacho_retira', '');
            setNotaValida(false);
        }

    };

    // Agregar producto localmente a la tabla
    const handleAgregarProducto = () => {
        const values = getValues();
        if (values.producto_id === null) {
            enqueueSnackbar('Debe seleccionar un producto válido desde la lista', { variant: 'warning' });
            return;
        }
        if (!values.producto_id || !values.cantidad) {
            enqueueSnackbar('Debe seleccionar producto y cantidad', { variant: 'warning' });
            return;
        }

        if (values.tipo === '' && (values.nota == null || values.nota == undefined || values.nota == '')) {
            enqueueSnackbar('Debe seleccionar un local antes de agregar el producto', { variant: 'warning' });
            return;
        }

        const nuevoProducto = {
            producto_id: values.producto_id,
            producto: typeof values.producto === 'string' ? values.producto : values.producto?.nombre,
            cantidad: values.cantidad,
            observacion: values.observacion || '',
            tipo: values.tipo,
        };

        setProductosAgregados((prev) => [...prev, nuevoProducto]);
        resetField('producto');
        resetField('producto_id');
        resetField('cantidad');
        resetField('tipo');
        resetField('observacion');
    };

    // Eliminar producto de la vista previa
    const handleEliminarProducto = (index) => {
        setProductosAgregados((prev) => prev.filter((_, i) => i !== index));
    };

    // Enviar productos al backend
    const onSubmit = async () => {
        const { nota_id, producto_id, producto, cantidad, observacion, tipo } = getValues();

        if (!notaValida) {
            enqueueSnackbar('La nota ingresada no es válida', {
                variant: 'error',
            });
            return;
        }

        // Si hay un producto escrito en el formulario y no se agregó manualmente
        if (producto_id && cantidad) {
            const nuevoProducto = {
                producto_id,
                producto: typeof producto === 'string' ? producto : producto?.nombre,
                cantidad,
                observacion: observacion || '',
                tipo,
            };
            setProductosAgregados((prev) => [...prev, nuevoProducto]);
        }

        await new Promise((resolve) => setTimeout(resolve, 0));

        if (productosAgregados.length === 0 && !(producto_id && cantidad)) {
            enqueueSnackbar('Debe agregar al menos un producto.', { variant: 'warning' });
            return;
        }

        if (!nota_id) {
            const todosTienenTipo = productosAgregados.every(p => p.tipo && p.tipo !== "");

            if (!todosTienenTipo) {
                enqueueSnackbar(
                    "Debe ingresar una nota válida o asegurarse de que todos los productos tengan local (tipo).",
                    { variant: "error" }
                );
                return;
            }
        }

        setLoading(true);
        try {
            const productosAEnviar =
                productosAgregados.length > 0
                    ? productosAgregados
                    : [{ producto_id, cantidad, observacion, tipo }];

            const guardadosExitosamente = [];
            const fallidos = [];

            for (const producto of productosAEnviar) {
                const payload = {
                    nota_id,
                    tipo: producto.tipo,
                    producto_id: producto.producto_id,
                    cantidad: producto.cantidad,
                    observacion: producto.observacion,
                };

                try {
                    await api.post('notas_productos/', transformMayus(payload));
                    guardadosExitosamente.push(producto);
                } catch (error) {
                    const msg = error.response?.data?.non_field_errors?.[0];

                    if (msg?.includes('conjunto único')) {
                        enqueueSnackbar(
                            `El producto "${producto.producto}" ya existe en esta nota.`,
                            { variant: 'warning' }
                        );
                    } else {
                        enqueueSnackbar(
                            `Error al guardar "${producto.producto}".`,
                            { variant: 'error' }
                        );
                    }

                    fallidos.push(producto);
                }
            }

            // Mostrar resumen general
            if (guardadosExitosamente.length > 0) {
                enqueueSnackbar(
                    `${guardadosExitosamente.length} producto(s) guardado(s) correctamente.`,
                    { variant: 'success' }
                );
            }

            if (fallidos.length > 0) {
                enqueueSnackbar(
                    `${fallidos.length} producto(s) no se pudieron guardar.`,
                    { variant: 'warning' }
                );
            }

            // Mantener en la vista previa solo los productos que no se guardaron
            setProductosAgregados((prev) =>
                prev.filter(
                    (p) =>
                        fallidos.some(
                            (f) =>
                                f.producto_id === p.producto_id &&
                                f.tipo === p.tipo &&
                                f.cantidad === p.cantidad
                        )
                )
            );

            // Limpieza del formulario
            resetField('producto');
            resetField('producto_id');
            resetField('cantidad', { defaultValue: '' });
            resetField('observacion');
            resetField('tipo');
        } catch (error) {
            console.error('Error general al guardar pedido:', error);
            enqueueSnackbar('Error general al guardar pedido', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };



    return (
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4, px: 4, py: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 2, background: '#00BFFF', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                FORMULARIO PEDIDOS
            </Typography>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        {/* Columna izquierda */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={2}>
                                <Controller
                                    name="nota"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Nota"
                                            fullWidth
                                            onBlur={handleBlurNota}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            autoComplete='off'
                                            InputLabelProps={{ shrink: !!field.value }}
                                        />
                                    )}
                                />

                                <SearchSelect
                                    name="producto"
                                    control={control}
                                    label="Producto"
                                    endpoint="/pedido_materias_primas/buscar-productos"
                                    autoComplete='off'
                                    autoCorrect="off"
                                    getOptionLabel={(option) =>
                                        typeof option === 'string' ? option : option.nombre
                                    }
                                    onSelect={(value) => {
                                        if (value) {
                                            setValue('producto_id', value.id_producto);
                                        } else {
                                            setValue('producto_id', null);
                                        }
                                    }}

                                />

                                <Controller
                                    name="cantidad"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Cantidad"
                                            type="number"
                                            fullWidth
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            InputProps={{
                                                endAdornment: (
                                                    <Tooltip title="Agregar producto">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={handleAgregarProducto}
                                                            edge="end"
                                                            sx={{ p: 0.5 }}
                                                        >
                                                            <AddCircleIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                ),
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="tipo"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Local"
                                            fullWidth
                                            size="small"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        >
                                            <MenuItem value="">Seleccione una opción</MenuItem>
                                            <MenuItem value="Franklin">Franklin</MenuItem>
                                            <MenuItem value="Stock">Stock</MenuItem>
                                            <MenuItem value="Tienda">Tienda</MenuItem>
                                        </TextField>
                                    )}
                                />
                            </Stack>
                        </Grid>

                        {/* Columna derecha */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={2}>
                                <Controller
                                    name="razon_social_cliente"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Cliente" fullWidth disabled InputLabelProps={{ shrink: !!field.value }} />
                                    )}
                                />

                                <Controller
                                    name="fecha_despacho"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Fecha Despacho" fullWidth disabled InputLabelProps={{ shrink: !!field.value }} />
                                    )}
                                />

                                <Controller
                                    name="despacho_retira"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Despacho - Retira" fullWidth disabled InputLabelProps={{ shrink: !!field.value }} />
                                    )}
                                />

                                <TextField
                                    label="Observación"
                                    {...register('observacion')}
                                    error={!!errors.observacion}
                                    helperText={errors.observacion?.message}
                                />
                            </Stack>
                        </Grid>

                        {/* Tabla vista previa */}
                        {productosAgregados.length > 0 && (
                            <Grid size={{ xs: 12, md: 12 }}>
                                <TableContainer component={Paper} sx={{ mt: 3 }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Producto</strong></TableCell>
                                                <TableCell><strong>Cantidad</strong></TableCell>
                                                <TableCell><strong>Tipo</strong></TableCell>
                                                <TableCell><strong>Observación</strong></TableCell>
                                                <TableCell align="center"><strong>Acción</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {productosAgregados.map((p, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{p.producto}</TableCell>
                                                    <TableCell>{p.cantidad}</TableCell>
                                                    <TableCell>{p.tipo}</TableCell>
                                                    <TableCell>{p.observacion}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton color="error" onClick={() => handleEliminarProducto(i)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        )}

                        {/* Botón final */}
                        <Grid size={{ xs: 12, md: 12 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{ mt: 2, background: '#00BFFF', color: 'white', fontSize: '1rem', '&:hover': { background: '#1C86EE' } }}
                            >
                                {loading ? 'Guardando...' : 'GUARDAR PEDIDO'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>
        </Box>
    );
};
