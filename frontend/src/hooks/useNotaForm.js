import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  num_nota: yup.number().transform((value, originalValue) =>
    String(originalValue).trim() === '' ? undefined : value
  ).required('Número de nota requerido'),
  razon_social: yup.string().required('Nombre del cliente requerido'),
  fecha_despacho: yup.date().required('Fecha de despacho requerida'),
  contacto: yup.string().required('Nombre de contacto requerido'),
  correo: yup.string().email('Correo inválido'),
  direccion: yup.string().required('Dirección requerida'),
  comuna: yup.string().required('Comuna requerida'),
  telefono: yup
  .string()
  .matches(/^[1-9]\d{8}$/, 'Teléfono debe tener 9 dígitos')
  .required('Teléfono requerido'),
  observacion: yup.string(),
  despacho_retira: yup.string(),
  horario_desde: yup.string(),
  horario_hasta: yup.string(),
});

export const useNotaForm = (onSubmit) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {  
      num_nota: '',
      rut_cliente: '',
      razon_social: '',
      direccion: '',
      comuna: '',    
      telefono: '',
      correo: '',
      contacto: '',
      observacion: '',
      fecha_despacho: null,
      horario_desde: '',
      horario_hasta: '',
      despacho_retira: ''
    }
  });

  const handleSubmit = methods.handleSubmit((data) => {
    const dataConPrefijo = {
      ...data,
      telefono: `+56${data.telefono}`,
    };
    onSubmit(dataConPrefijo);
  });

  return {
    ...methods,
    onSubmit: handleSubmit,
  };
};
