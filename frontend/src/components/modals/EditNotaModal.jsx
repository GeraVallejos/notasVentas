import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
  Typography,
  Box
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../utils/api';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { parse, format, isValid } from 'date-fns';
import { ComunaAutocomplete } from '../common/ComunaAutocomplete';

const schema = yup.object().shape({
  num_nota: yup.number().required('Número de nota requerido'),
  razon_social: yup.string().required('Nombre del cliente requerido'),
  rut_cliente: yup.string(),
  fecha_despacho: yup.date().required('Fecha de despacho requerida').typeError('Fecha inválida'),
  contacto: yup.string().required('Nombre de contacto requerido'),
  telefono: yup
    .string()
    .matches(/^[1-9]\d{8}$/, 'Debe tener 9 dígitos')
    .required('Teléfono requerido'),
  direccion: yup.string().required('Dirección requerida'),
  comuna: yup.string().required('Comuna requerida'),
  observacion: yup.string(),
  despacho_retira: yup.string().required('Debe elegir entre despacho o retira'),
  horario_desde: yup.string().nullable(),
  horario_hasta: yup.string().nullable(),
  estado_solicitud: yup.string().oneOf(["Solicitado", "No Solicitado"]).required("El estado es obligatorio"),
  notas_usuario: yup.string(),
  password: yup.string().required('Contraseña requerida'),
});

const EditNotaModal = ({ open, onClose, nota, onSave }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [clienteOriginal, setClienteOriginal] = useState(null);
  const [confirmarActualizacion, setConfirmarActualizacion] = useState(false);


  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {}
  });

  const { register, handleSubmit, reset, setValue, control, formState: { errors }, watch, getValues } = methods;

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

  useEffect(() => {
    if (nota) {
      setClienteOriginal({
        razon_social: nota.razon_social || '',
        direccion: nota.direccion || '',
        comuna: nota.comuna || '',
        telefono: nota.telefono?.replace(/\D/g, '').slice(-9) || '',
        correo: nota.correo || '',
        contacto: nota.contacto || '',
      });


      reset({
        ...nota,
        telefono: nota.telefono?.startsWith('+56') ? nota.telefono.slice(3) : nota.telefono,
        fecha_despacho: nota.fecha_despacho ? new Date(nota.fecha_despacho) : null,
        estado_solicitud: nota.estado_solicitud || '',
        horario_desde: typeof nota.horario_desde === 'string' ? nota.horario_desde : '',
        horario_hasta: typeof nota.horario_hasta === 'string' ? nota.horario_hasta : '',
        password: ''
      });
    }
  }, [nota, reset]);

  const {
    razon_social,
    direccion,
    comuna,
    telefono,
    correo,
    contacto
  } = watch();

  const camposEditados = useMemo(() => {
    if (!clienteOriginal) return [];

    const campos = ['razon_social', 'direccion', 'comuna', 'telefono', 'correo', 'contacto'];
    const actuales = { razon_social, direccion, comuna, telefono, correo, contacto };

    return campos.filter((campo) => actuales[campo] !== clienteOriginal[campo]);
  }, [razon_social, direccion, comuna, telefono, correo, contacto, clienteOriginal]);

  // Actualizar cliente si hay cambios
  const actualizarClienteYNota = async () => {
    const data = getValues();
    try {
      if (camposEditados.length > 0 && clienteOriginal) {
        const clientePayload = {
          razon_social: data.razon_social,
          direccion: data.direccion,
          comuna: data.comuna,
          telefono: `+56${data.telefono}`,
          correo: data.correo,
          contacto: data.contacto,
        };

        await api.patch('/cliente/por-rut/', transformMayus(clientePayload, ['correo']), {
          params: { rut: data.rut_cliente }
        });

        enqueueSnackbar('Cliente actualizado exitosamente', { variant: 'info' });
      }

      await guardarNota(data);
      setConfirmarActualizacion(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error al actualizar cliente', { variant: 'error' });
      setLoading(false);
    }
  };

  // Guardar solo la nota
  const guardarNota = async (data) => {
    try {
      const res = await api.post('/usuario/verify_password/', { password: data.password });
      if (!res.data.valid) {
        enqueueSnackbar('Contraseña incorrecta', { variant: 'error' });
        return;
      }

      const cleanHorario = (value) =>
        typeof value === 'string' && /^\d{2}:\d{2}$/.test(value.trim()) ? value : '';

      const payload = {
        ...data,
        telefono: `+56${data.telefono}`,
        horario_desde: cleanHorario(data.horario_desde),
        horario_hasta: cleanHorario(data.horario_hasta),
        fecha_despacho: data.fecha_despacho?.toISOString(),
      };
      delete payload.password;

      await api.put(`/nota/${nota.id_nota}/`, payload);
      enqueueSnackbar('Pedido actualizado', { variant: 'success' });
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Error al actualizar el Pedido', { variant: 'error' });
    } finally {
      setValue('password', '');
      setLoading(false);
    }
  };


  const onSubmit = async (data) => {
    setLoading(true);
    if (camposEditados.length > 0) {
      setConfirmarActualizacion(true);
    } else {
      await guardarNota(data);
    }
  };



  const handleClose = () => {
    setValue('password', '');
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Editar Nota</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent dividers>
              <Stack spacing={2} mt={1}>
                <TextField label="N° nota" {...register('num_nota')} error={!!errors.num_nota} helperText={errors.num_nota?.message} fullWidth />
                <TextField label="Razon Social" {...register('razon_social')} error={!!errors.razon_social} helperText={errors.razon_social?.message} fullWidth />
                <TextField label="RUT Cliente" {...register('rut_cliente')} fullWidth />
                <TextField label="Correo" {...register('correo')} fullWidth />
                <Controller
                  name="fecha_despacho"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Fecha Despacho"
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          error: !!errors.fecha_despacho,
                          helperText: errors.fecha_despacho?.message,
                        },
                      }}
                    />
                  )}
                />
                <TextField label="Contacto" {...register('contacto')} error={!!errors.contacto} helperText={errors.contacto?.message} fullWidth />
                <TextField
                  label="Teléfono"
                  {...register('telefono')}
                  error={!!errors.telefono}
                  helperText={errors.telefono?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start" sx={{ mt: '1px' }}>+56</InputAdornment>,
                    inputMode: 'numeric',
                  }}
                  inputProps={{
                    maxLength: 9,
                    pattern: '[0-9]*',
                  }}
                  fullWidth
                />
                <TextField label="Dirección" {...register('direccion')} error={!!errors.direccion} helperText={errors.direccion?.message} fullWidth />
                <Controller
                  name="comuna"
                  control={control}
                  render={({ field, fieldState }) => (
                    <ComunaAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller name="despacho_retira" control={control} defaultValue='' render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} size='small'>
                    <InputLabel id="despacho-label">Despacho</InputLabel>
                    <Select {...field} labelId="despacho-label" label="Tipo Despacho">
                      <MenuItem value="">Seleccione una opción</MenuItem>
                      <MenuItem value="DESPACHO">Despacho</MenuItem>
                      <MenuItem value="RETIRA">Retira</MenuItem>
                    </Select>
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  </FormControl>)} />
                <TextField label="Observación" {...register('observacion')} multiline fullWidth rows={1} />
                <Controller
                  name="horario_desde"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      label="Horario Desde"
                      ampm={false}
                      value={field.value ? parse(field.value, 'HH:mm', new Date()) : null}
                      onChange={(time) => {
                        if (time && isValid(time)) {
                          field.onChange(format(time, 'HH:mm'));
                        } else {
                          field.onChange('');
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          error: !!errors.horario_desde,
                          helperText: errors.horario_desde?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="horario_hasta"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      label="Horario Hasta"
                      ampm={false}
                      value={field.value ? parse(field.value, 'HH:mm', new Date()) : null}
                      onChange={(time) => {
                        if (time && isValid(time)) {
                          field.onChange(format(time, 'HH:mm'));
                        } else {
                          field.onChange('');
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          error: !!errors.horario_hasta,
                          helperText: errors.horario_hasta?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="estado_solicitud"
                  control={control}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={!!fieldState.error}>
                      <InputLabel id="estado-label">Estado</InputLabel>
                      <Select
                        {...field}
                        labelId="estado-label"
                        label="Estado"
                      >
                        <MenuItem value="Solicitado">Solicitado</MenuItem>
                        <MenuItem value="No Solicitado">No solicitado</MenuItem>
                      </Select>
                      <FormHelperText>{fieldState.error?.message}</FormHelperText>
                    </FormControl>
                  )}
                />
                <TextField
                  label="Contraseña"
                  autoComplete='current-password'
                  type="password"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
      {/* Diálogo de confirmación de actualización de cliente */}
      <Dialog open={confirmarActualizacion} onClose={() => setConfirmarActualizacion(false)}>
        <DialogTitle>Actualizar datos del cliente</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Has modificado los siguientes campos del cliente:{' '}
            <Box component="span" sx={{ color: 'red' }}>
              {camposEditados.join(', ')}.{' '}
            </Box>
            ¿Deseas actualizar los datos del cliente en la base de datos?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setConfirmarActualizacion(false); guardarNota(getValues()); }}>
            No, mantener datos originales
          </Button>
          <Button onClick={actualizarClienteYNota} variant="contained" color="primary">
            Sí, actualizar cliente
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditNotaModal;
