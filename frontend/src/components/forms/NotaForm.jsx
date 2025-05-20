import {
    Box,
    Button,
    Grid,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { FormProvider } from 'react-hook-form';
import { useNotaForm } from '../../hooks/useNotaForm';
import { api } from '../../utils/api';
import { useSnackbar } from 'notistack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

export const NotaForm = () => {
    const { enqueueSnackbar } = useSnackbar();

    const form = useNotaForm(async (data) => {
        try {
            await api.post('/nota/', data);
            enqueueSnackbar('Nota creada exitosamente', { variant: 'success' });
            form.reset();
        } catch (error) {
            console.log(error.response?.data);
            const msg = error.response?.data?.detail || 'Error al crear la nota';
            enqueueSnackbar(msg, { variant: 'error' });
        }
    });

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 700, // más ancho
                mx: 'auto',
                mt: 2,
                px: 4,
                py: 2,
                bgcolor: '#f0faff',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    textAlign: 'center',
                    mb: 2,
                    background: 'linear-gradient(to right, #00BFFF, #1E90FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                Crear Pedido
            </Typography>

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(form.onSubmit)} noValidate>
                    <Grid container spacing={2}>
                        {/* Columna izquierda */}
                        <Grid size={{ xs: 12, md: 6 }} >
                            <Stack spacing={2}>
                                <TextField
                                    label="Número de Nota"
                                    type="number"
                                    {...form.register('num_nota')}
                                    error={!!form.formState.errors.num_nota}
                                    helperText={form.formState.errors.num_nota?.message}
                                />
                                <TextField
                                    label="Nombre del Cliente"
                                    {...form.register('nombre_cliente')}
                                    error={!!form.formState.errors.nombre_cliente}
                                    helperText={form.formState.errors.nombre_cliente?.message}
                                />

                                <TextField
                                    label="Contacto"
                                    {...form.register('contacto')}
                                    error={!!form.formState.errors.contacto}
                                    helperText={form.formState.errors.contacto?.message}
                                />
                                <TextField
                                    label="Correo"
                                    type="email"
                                    {...form.register('correo')}
                                    error={!!form.formState.errors.correo}
                                    helperText={form.formState.errors.correo?.message}
                                />
                                <TimePicker
                                    label="Horario Desde"
                                    value={form.watch('horario_desde') ? dayjs(form.watch('horario_desde')) : null}
                                    onChange={(time) => form.setValue('horario_desde', time?.toISOString())}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: 'small',
                                            error: !!form.formState.errors.horario_desde,
                                            helperText: form.formState.errors.horario_desde?.message,
                                        },
                                    }}
                                />
                            </Stack>
                        </Grid>

                        {/* Columna derecha */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Dirección"
                                    {...form.register('direccion')}
                                    error={!!form.formState.errors.direccion}
                                    helperText={form.formState.errors.direccion?.message}
                                />
                                <TextField
                                    label="Comuna"
                                    {...form.register('comuna')}
                                    error={!!form.formState.errors.comuna}
                                    helperText={form.formState.errors.comuna?.message}
                                />
                                <DatePicker
                                    label="Fecha de Despacho"
                                    value={form.watch('fecha_despacho') ? dayjs(form.watch('fecha_despacho')) : null}
                                    onChange={(date) => form.setValue('fecha_despacho', date?.toISOString())}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: 'small',
                                            error: !!form.formState.errors.fecha_despacho,
                                            helperText: form.formState.errors.fecha_despacho?.message,
                                        },
                                    }}
                                />
                                <TextField
                                    label="Teléfono"
                                    {...form.register('telefono')}
                                    error={!!form.formState.errors.telefono}
                                    helperText={form.formState.errors.telefono?.message}
                                />
                                <TimePicker
                                    label="Horario Hasta"
                                    value={form.watch('horario_hasta') ? dayjs(form.watch('horario_hasta')) : null}
                                    onChange={(time) => form.setValue('horario_hasta', time?.toISOString())}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            size: 'small',
                                            error: !!form.formState.errors.horario_hasta,
                                            helperText: form.formState.errors.horario_hasta?.message,
                                        },
                                    }}
                                />

                            </Stack>
                        </Grid>
                        <Grid size={{ xs: 12, md: 12 }} >
                            <TextField
                                label="Observación"
                                multiline
                                fullWidth
                                rows={3}
                                {...form.register('observacion')}
                                error={!!form.formState.errors.observacion}
                                helperText={form.formState.errors.observacion?.message}
                            />
                        </Grid>
                        {/* Botón de envío */}
                        <Grid size={{ xs: 12, md: 12 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={form.formState.isSubmitting}
                                sx={{
                                    mt: 2,
                                    background: 'linear-gradient(to right, #00BFFF, #1E90FF)',
                                    color: 'white',
                                    fontSize: '1.25rem',
                                    borderRadius: 2,
                                    '&:hover': {
                                        background: 'linear-gradient(to right, #00B2EE, #1C86EE)',
                                    },
                                    opacity: form.formState.isSubmitting ? 0.7 : 1,
                                    '&.Mui-disabled': {
                                        color: 'white', // fuerza texto blanco
                                    },
                                }}
                            >
                                {form.formState.isSubmitting ? 'Guardando...' : 'Crear Nota'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>
        </Box>
    );
};
