import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  razon_social: yup.string().required('Nombre del proveedor requerido'),
  rut_cliente: yup.string().required('Rut del proveedor requerido'),
  fecha_despacho: yup.date().required('Fecha de despacho requerida'),
  observacion: yup.string(),
  producto: yup.string().required('Producto requerido'),
  cantidad: yup.string().required('Cantidad requerida'),
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
