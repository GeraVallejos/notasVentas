import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../utils/api';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';

const schema = yup.object().shape({
  num_nota: yup.number().required('Número de nota requerido'),
  nombre_cliente: yup.string().required('Nombre del cliente requerido'),
  rut_cliente: yup.string(),
  fecha_despacho: yup.string().required('Fecha de despacho requerida'),
  contacto: yup.string().required('Nombre de contacto requerido'),
  telefono: yup.string().required('Teléfono requerido'),
  direccion: yup.string().required('Dirección requerida'),
  comuna: yup.string().required('Comuna requerida'),
  observacion: yup.string(),
  horario_desde: yup.string(),
  horario_hasta: yup.string(),
  estado_solicitud: yup.string().oneOf(["Solicitado", "No Solicitado"]).required("El estado es obligatorio"),
  notas_usuario: yup.string(),
  password: yup.string().required('Contraseña requerida'),
});

const EditNotaModal = ({ open, onClose, nota, onSave }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {}
  });

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = methods;

  useEffect(() => {
    if (nota) {
      reset({
        ...nota,
        fecha_despacho: nota.fecha_despacho?.slice(0, 10),
        password: ''
      });
    }
  }, [nota, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/usuario/verify_password/', { password: data.password });
      if (res.data.valid) {
        const payload = { ...data };
        delete payload.password;

        await api.put(`/nota/${nota.id_nota}/`, payload);
        enqueueSnackbar('Pedido actualizado', { variant: 'success' });
        onSave();
        onClose();
      } else {
        enqueueSnackbar('Contraseña incorrecta', { variant: 'error' });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Error al actualizar el Pedido', { variant: 'error' });
    } finally {
      setValue('password', '');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setValue('password', '');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Editar Nota</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Stack spacing={2} mt={1}>
              <TextField label="N° nota" {...register('num_nota')} error={!!errors.num_nota} helperText={errors.num_nota?.message} fullWidth />
              <TextField label="Cliente" {...register('nombre_cliente')} error={!!errors.nombre_cliente} helperText={errors.nombre_cliente?.message} fullWidth />
              <TextField label="RUT Cliente" {...register('rut_cliente')} fullWidth />
              <TextField label="Fecha Despacho" type="date" {...register('fecha_despacho')} InputLabelProps={{ shrink: true }} error={!!errors.fecha_despacho} helperText={errors.fecha_despacho?.message} fullWidth />
              <TextField label="Contacto" {...register('contacto')} error={!!errors.contacto} helperText={errors.contacto?.message} fullWidth />
              <TextField label="Teléfono" {...register('telefono')} error={!!errors.telefono} helperText={errors.telefono?.message} fullWidth />
              <TextField label="Dirección" {...register('direccion')} error={!!errors.direccion} helperText={errors.direccion?.message} fullWidth />
              <TextField label="Comuna" {...register('comuna')} error={!!errors.comuna} helperText={errors.comuna?.message} fullWidth />
              <TextField label="Observación" {...register('observacion')} fullWidth />
              <TextField label="Horario Desde" {...register('horario_desde')} fullWidth />
              <TextField label="Horario Hasta" {...register('horario_hasta')} fullWidth />
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
  );
};

export default EditNotaModal;
