import {
  Box,
  Button,
  Grid,
  MenuItem,
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
import { useState, useMemo } from 'react';
import { formatearRut } from '../../utils/formatearRut';

export const NotaForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [clienteNuevo, setClienteNuevo] = useState(null);
  const [clienteOriginal, setClienteOriginal] = useState(null);



  // Funcion para dejar los strigs de la data en mayus, con exepciones
  const transformMayus = (obj, excluir = []) => {
    const nuevoObj = { ...obj };
    for (const key in nuevoObj) {
      if (typeof nuevoObj[key] === 'string' && !excluir.includes(key)) {
        nuevoObj[key] = nuevoObj[key].toUpperCase();
      }
    }
    return nuevoObj;
  };

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
      num_nota: data.num_nota,
      rut_cliente: data.rut_cliente,
      fecha_despacho: data.fecha_despacho,
      observacion: data.observacion,
      despacho_retira: data.despacho_retira,
      horario_desde: data.horario_desde,
      horario_hasta: data.horario_hasta,
      guardar_cliente: guardarCliente,
      };

      await api.post('/nota/', transformMayus(payload, ['correo']));
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

      const telefonoSinPrefijo = data.telefono?.replace(/\D/g, '').slice(-9) || '';

      // Guardar los datos originales del cliente para comparar después
      setClienteOriginal({
        razon_social: data.razon_social || '',
        direccion: data.direccion || '',
        comuna: data.comuna || '',
        telefono: telefonoSinPrefijo || '',
        correo: data.correo || '',
        contacto: data.contacto || '',
      });

      form.setValue('razon_social', data.razon_social || '');
      form.setValue('direccion', data.direccion || '');
      form.setValue('comuna', data.comuna || '');
      form.setValue('telefono', telefonoSinPrefijo || '');
      form.setValue('correo', data.correo || '');
      form.setValue('contacto', data.contacto || '');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Cliente no encontrado', { variant: 'warning' });
    }
  };

  const {
    razon_social,
    direccion,
    comuna,
    telefono,
    correo,
    contacto
  } = form.watch();

  const camposEditados = useMemo(() => {
    if (!clienteOriginal) return [];

    const camposCliente = ['razon_social', 'direccion', 'comuna', 'telefono', 'correo', 'contacto'];
    const valoresActuales = { razon_social, direccion, comuna, telefono, correo, contacto };

    return camposCliente.filter(campo => {
      return valoresActuales[campo] !== clienteOriginal[campo];
    });
  }, [razon_social, direccion, comuna, telefono, correo, contacto, clienteOriginal]);


  const handleSubmitNota = async (e) => {
    e.preventDefault();

    // Primero verifica si hay campos de cliente editados
    if (camposEditados.length > 0 && clienteOriginal) {
      setOpenEditDialog(true);
      return;
    }

    // Si no hay campos editados, procede con el submit normal
    form.handleSubmit(form.onSubmit)(e);
  };

  const actualizarCliente = async () => {
    try {
      const data = form.getValues();
      const payload = {
        ...transformMayus(data, ['correo']),
        telefono: `+56${data.telefono}`,
      };

      await api.patch('/cliente/por-rut/', payload, {
        params: {
          rut: data.rut_cliente
        }
      });

      enqueueSnackbar('Cliente actualizado exitosamente', { variant: 'success' });
      setOpenEditDialog(false);

      // Continuar con el envío de la nota
      await form.onSubmit();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.detail || 'Error al actualizar el cliente';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };


  return (
    <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', mt: 2, px: 4, py: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 2, background: ' #00BFFF', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        FORMULARIO PEDIDOS
      </Typography>

      <FormProvider {...form}>
        <form onSubmit={handleSubmitNota} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <TextField label="Número de Nota" autoComplete="off" type="number" {...form.register('num_nota')} error={!!form.formState.errors.num_nota} helperText={form.formState.errors.num_nota?.message} />
                <TextField label="Rut Cliente" autoComplete="off" {...form.register('rut_cliente')} onChange={handleChangeRut} onBlur={handleBlurRut} error={!!form.formState.errors.rut_cliente} helperText={form.formState.errors.rut_cliente?.message} />
                <Controller name="razon_social" autoComplete="off" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Razón Social" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <Controller name="contacto" autoComplete="off" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Contacto" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <Controller name="correo" autoComplete="off" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Correo" type="email" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <TimePicker label="Horario Desde" autoComplete="off" ampm={false} value={form.watch('horario_desde') ? parse(form.watch('horario_desde'), 'HH:mm', new Date()) : null} onChange={(time) => form.setValue('horario_desde', isValid(time) ? format(time, 'HH:mm') : '')} slotProps={{ textField: { fullWidth: true, size: 'small', error: !!form.formState.errors.horario_desde, helperText: form.formState.errors.horario_desde?.message } }} />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Controller name="direccion" autoComplete="off" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Dirección" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <Controller name="comuna" control={form.control} render={({ field, fieldState }) => <ComunaAutocomplete value={field.value} onChange={field.onChange} error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <DatePicker label="Fecha de Despacho" autoComplete="off" value={form.watch('fecha_despacho') ? parseISO(form.watch('fecha_despacho')) : null} onChange={(date) => form.setValue('fecha_despacho', isValid(date) ? date.toISOString() : '')} format="dd/MM/yyyy" slotProps={{ textField: { fullWidth: true, size: 'small', error: !!form.formState.errors.fecha_despacho, helperText: form.formState.errors.fecha_despacho?.message } }} />
                <Controller name="telefono" autoComplete="off" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Teléfono" fullWidth onChange={(e) => { let value = e.target.value.replace(/\D/g, ''); if (value.length <= 9) field.onChange(value); }} InputProps={{ startAdornment: <InputAdornment position="start" sx={{mt:'1px'}}>+56</InputAdornment>, inputMode: 'numeric' }} inputProps={{ maxLength: 9, pattern: '[0-9]*' }} error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <Controller
                  name="despacho_retira"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      select
                      label="Despacho"
                      fullWidth
                      size="small"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    >
                      <MenuItem value="">Seleccione una opción</MenuItem>
                      <MenuItem value="Despacho">Despacho</MenuItem>
                      <MenuItem value="Retira">Retira</MenuItem>
                    </TextField>
                  )}
                />
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

      {/* Diálogo para editar cliente */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Actualizar datos del cliente</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Has modificado los siguientes campos del cliente: {camposEditados.join(', ')}.
            ¿Deseas actualizar los datos del cliente en la base de datos?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenEditDialog(false); form.handleSubmit(form.onSubmit)(); }}>No, mantener datos originales</Button>
          <Button onClick={actualizarCliente} color="primary" variant="contained">Sí, actualizar cliente</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
