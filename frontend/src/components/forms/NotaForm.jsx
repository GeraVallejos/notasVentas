import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Controller, FormProvider } from 'react-hook-form';
import { useNotaForm } from '../../hooks/useNotaForm';
import { api } from '../../utils/api';
import { useSnackbar } from 'notistack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { parse, parseISO, format, isValid } from 'date-fns';
import { ComunaAutocomplete } from '../common/ComunaAutocomplete';
import { useState } from 'react';
import { formatearRut } from '../../utils/formatearRut';

export const NotaForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [clienteNuevo, setClienteNuevo] = useState(null);

  const form = useNotaForm(async (data) => {
    try {
      const { data: res } = await api.get('/nota/validar-numero/', {
        params: { num_nota: data.num_nota },
      });

      if (res.existe) {
        form.setError('num_nota', {
          type: 'manual',
          message: 'Ya existe una nota con este número',
        });
        return;
      }

      try {
        await api.get('/cliente/por-rut/', {
          params: { rut: data.rut_cliente },
        });
        await crearNota(data);
      } catch (error) {
        if (error.response?.status === 404) {
          setClienteNuevo(data);
          setOpenDialog(true);
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || 'Error al crear la nota';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  });

  const crearNota = async (data, guardarCliente = false) => {
    try {
      const payload = {
        ...data,
        rut_cliente: data.rut_cliente,
        guardar_cliente: guardarCliente || false
      };

      await api.post('/nota/', payload);
      enqueueSnackbar('Nota creada exitosamente', { variant: 'success' });
      form.reset({ num_nota: '', rut_cliente: '', observacion: '' });
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || 'Error al crear la nota';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  const handleChangeRut = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatearRut(rawValue);
    form.setValue('rut_cliente', formattedValue, { shouldValidate: true });
  };

  const handleBlurRut = async (e) => {
    const rutFormateado = e.target.value;
    if (!rutFormateado) return;

    try {
      const { data } = await api.get('/cliente/por-rut/', {
        params: { rut: rutFormateado },
      });

      form.setValue('razon_social', data.razon_social || '');
      form.setValue('direccion', data.direccion || '');
      form.setValue('comuna', data.comuna || '');
      form.setValue('telefono', data.telefono || '');
      form.setValue('correo', data.correo || '');
      form.setValue('contacto', data.contacto || '');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Cliente no encontrado', { variant: 'warning' });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', mt: 2, px: 4, py: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 2, background: ' #00BFFF', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        FORMULARIO PEDIDOS
      </Typography>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(form.onSubmit)} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <TextField label="Número de Nota" type="number" {...form.register('num_nota')} error={!!form.formState.errors.num_nota} helperText={form.formState.errors.num_nota?.message} />
                <TextField label="Rut Cliente" {...form.register('rut_cliente')} onChange={handleChangeRut} onBlur={handleBlurRut} error={!!form.formState.errors.rut_cliente} helperText={form.formState.errors.rut_cliente?.message} />
                <Controller name="razon_social" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Razón Social" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <Controller name="contacto" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Contacto" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <Controller name="correo" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Correo" type="email" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <TimePicker label="Horario Desde" ampm={false} value={form.watch('horario_desde') ? parse(form.watch('horario_desde'), 'HH:mm', new Date()) : null} onChange={(time) => form.setValue('horario_desde', isValid(time) ? format(time, 'HH:mm') : '')} slotProps={{ textField: { fullWidth: true, size: 'small', error: !!form.formState.errors.horario_desde, helperText: form.formState.errors.horario_desde?.message } }} />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Controller name="direccion" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Dirección" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <Controller name="comuna" control={form.control} render={({ field, fieldState }) => <ComunaAutocomplete value={field.value} onChange={field.onChange} error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <DatePicker label="Fecha de Despacho" value={form.watch('fecha_despacho') ? parseISO(form.watch('fecha_despacho')) : null} onChange={(date) => form.setValue('fecha_despacho', isValid(date) ? date.toISOString() : '')} format="dd/MM/yyyy" slotProps={{ textField: { fullWidth: true, size: 'small', error: !!form.formState.errors.fecha_despacho, helperText: form.formState.errors.fecha_despacho?.message } }} />
                <Controller name="telefono" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Teléfono" fullWidth onChange={(e) => { let value = e.target.value.replace(/\D/g, ''); if (value.length <= 9) field.onChange(value); }} InputProps={{ startAdornment: <InputAdornment position="start">+56</InputAdornment>, inputMode: 'numeric' }} inputProps={{ maxLength: 9, pattern: '[0-9]*' }} error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <Controller name="despacho_retira" control={form.control} defaultValue='' render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} size='small'>
                    <InputLabel id="despacho-label">Despacho</InputLabel>
                    <Select {...field} labelId="despacho-label" label="Tipo Despacho">
                      <MenuItem value="">Seleccione una opción</MenuItem>
                      <MenuItem value="Despacho">Despacho</MenuItem>
                      <MenuItem value="Retira">Retira</MenuItem>
                    </Select>
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  </FormControl>
                )} />
                <TimePicker label="Horario Hasta" ampm={false} value={form.watch('horario_hasta') ? parse(form.watch('horario_hasta'), 'HH:mm', new Date()) : null} onChange={(time) => form.setValue('horario_hasta', isValid(time) ? format(time, 'HH:mm') : '')} slotProps={{ textField: { fullWidth: true, size: 'small', error: !!form.formState.errors.horario_hasta, helperText: form.formState.errors.horario_hasta?.message } }} />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <Controller name="observacion" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Observación" multiline fullWidth rows={1} InputLabelProps={{ shrink: !!field.value }} error={!!fieldState.error} helperText={fieldState.error?.message} />} />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <Button type="submit" variant="contained" fullWidth disabled={form.formState.isSubmitting} sx={{ mt: 2, background: ' #00BFFF', color: 'white', fontSize: '1rem', '&:hover': { background: '#1C86EE' } }}>
                {form.formState.isSubmitting ? 'Guardando...' : 'CREAR PEDIDO'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cliente no encontrado</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            El cliente con RUT {clienteNuevo?.rut_cliente} no existe en la base de datos.
            ¿Desea guardar este cliente para futuras notas?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenDialog(false); crearNota(clienteNuevo, false); }}>No, solo crear nota</Button>
          <Button onClick={() => crearNota(clienteNuevo, true)} color="primary" variant="contained">Sí, guardar cliente</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
