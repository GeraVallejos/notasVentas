import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { notaSchema } from '../utils/notaShema'
import { api } from '../utils/api';
import { format } from 'date-fns';

const formatTime = (time) => {
  if (!time) return null;
  if (typeof time === 'string' && time.match(/^\d{2}:\d{2}$/)) return time;
  if (time instanceof Date) return format(time, 'HH:mm');
  return null;
};

const useNotaForm = ({ nota, onClose, onSave, enqueueSnackbar }) => {
  const methods = useForm({
    resolver: yupResolver(notaSchema),
    mode: 'onTouched',
    defaultValues: {
      num_nota: '',
      razon_social: '',
      rut_cliente: '',
      correo: '',
      fecha_despacho: null,
      contacto: '',
      telefono: '',
      direccion: '',
      comuna: '',
      observacion: '',
      despacho_retira: '',
      horario_desde: '',
      horario_hasta: '',
      estado_solicitud: '',
      password: ''
    },
  });

  const { reset, setValue, handleSubmit, ...rest } = methods;

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/usuario/verify_password/', { password: data.password });
      if (!res.data.valid) {
        enqueueSnackbar('Contraseña incorrecta', { variant: 'error' });
        return;
      }

      const payload = {
        ...data,
        telefono: `+56${data.telefono}`,
        horario_desde: formatTime(data.horario_desde),
        horario_hasta: formatTime(data.horario_hasta),
        fecha_despacho: data.fecha_despacho?.toISOString(),
      };
      delete payload.password;

      await api.put(`/nota/${nota.id_nota}/`, payload);
      enqueueSnackbar('Pedido actualizado', { variant: 'success' });
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error al actualizar el pedido', { variant: 'error' });
    } finally {
      setValue('password', '');
    }
  };

  const handleClose = () => {
    setValue('password', '');
    onClose();
  };

  // Populate form when nota cambia
  if (nota) {
    reset({
      ...nota,
      telefono: nota.telefono?.startsWith('+56') ? nota.telefono.slice(3) : nota.telefono,
      fecha_despacho: nota.fecha_despacho ? new Date(nota.fecha_despacho) : null,
      horario_desde: typeof nota.horario_desde === 'string' ? nota.horario_desde : '',
      horario_hasta: typeof nota.horario_hasta === 'string' ? nota.horario_hasta : '',
      password: '',
    });
  }

  return {
    methods: { ...rest, handleSubmit, reset, setValue },
    onSubmit: handleSubmit(onSubmit),
    handleClose,
    loading: rest.formState.isSubmitting,
  };
};

export default useNotaForm;
