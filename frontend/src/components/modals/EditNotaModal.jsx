import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack,
  FormControl, InputLabel, Select, MenuItem, FormHelperText, InputAdornment
} from '@mui/material';
import { FormProvider, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { parse, isValid, format } from 'date-fns';
import { useSnackbar } from 'notistack';
import useNotaForm from '../../hooks/useNotaForm';
import { ComunaAutocomplete } from '../common/ComunaAutocomplete';

const EditNotaModal = ({ open, onClose, nota, onSave }) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    methods,
    onSubmit,
    handleClose,
    loading
  } = useNotaForm({ nota, onClose, onSave, enqueueSnackbar });

  const {
    register,
    control,
    formState: { errors }
  } = methods;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Editar Nota</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <DialogContent dividers>
            <Stack spacing={2} mt={1}>
              <TextField
                label="N° nota"
                {...register('num_nota')}
                error={!!errors.num_nota}
                helperText={errors.num_nota?.message}
                fullWidth
              />
              <TextField
                label="Razón Social"
                {...register('razon_social')}
                error={!!errors.razon_social}
                helperText={errors.razon_social?.message}
                fullWidth
              />
              <TextField
                label="RUT Cliente"
                {...register('rut_cliente')}
                error={!!errors.rut_cliente}
                helperText={errors.rut_cliente?.message}
                fullWidth
              />
              <TextField
                label="Correo"
                {...register('correo')}
                error={!!errors.correo}
                helperText={errors.correo?.message}
                fullWidth
              />
              <Controller
                name="fecha_despacho"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha Despacho"
                    value={field.value}
                    onChange={field.onChange}
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: !!errors.fecha_despacho,
                        helperText: errors.fecha_despacho?.message
                      }
                    }}
                  />
                )}
              />
              <TextField
                label="Contacto"
                {...register('contacto')}
                error={!!errors.contacto}
                helperText={errors.contacto?.message}
                fullWidth
              />
              <TextField
                label="Teléfono"
                {...register('telefono')}
                error={!!errors.telefono}
                helperText={errors.telefono?.message}
                InputProps={{
                  startAdornment: <InputAdornment position="start">+56</InputAdornment>,
                  inputMode: 'numeric'
                }}
                inputProps={{ maxLength: 9, pattern: '[0-9]*' }}
                fullWidth
              />
              <TextField
                label="Dirección"
                {...register('direccion')}
                error={!!errors.direccion}
                helperText={errors.direccion?.message}
                fullWidth
              />
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
              <Controller
                name="despacho_retira"
                control={control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} size="small">
                    <InputLabel id="despacho-label">Tipo Despacho</InputLabel>
                    <Select {...field} labelId="despacho-label" label="Tipo Despacho">
                      <MenuItem value="">Seleccione una opción</MenuItem>
                      <MenuItem value="Despacho">Despacho</MenuItem>
                      <MenuItem value="Retira">Retira</MenuItem>
                    </Select>
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  </FormControl>
                )}
              />
              <TextField
                label="Observación"
                {...register('observacion')}
                fullWidth
              />
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
                        helperText: errors.horario_desde?.message
                      }
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
                        helperText: errors.horario_hasta?.message
                      }
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
                    <Select {...field} labelId="estado-label" label="Estado">
                      <MenuItem value="Solicitado">Solicitado</MenuItem>
                      <MenuItem value="No Solicitado">No Solicitado</MenuItem>
                    </Select>
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  </FormControl>
                )}
              />
              <TextField
                label="Contraseña"
                type="password"
                autoComplete="current-password"
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
