import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  num_nota: yup.number().transform((value, originalValue) =>
    String(originalValue).trim() === '' ? undefined : value
  ).required('Número de nota requerido'),
  nombre_cliente: yup.string().required('Nombre del cliente requerido'),
  fecha_despacho: yup.date().required('Fecha de despacho requerida'),
  contacto: yup.string().required('Nombre de contacto requerido'),
  correo: yup.string().email('Correo inválido'),
  direccion: yup.string().required('Dirección requerida'),
  comuna: yup.string().required('Comuna requerida'),
  telefono: yup.string().required('Teléfono requerido'),
  observacion: yup.string(),
  horario_desde: yup.string(),
  horario_hasta: yup.string(),
});

export const useNotaForm = (onSubmit) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  return {
    ...methods,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};
