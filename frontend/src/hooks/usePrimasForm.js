import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  razon_social: yup.string().required('Nombre del proveedor requerido'),
  rut_proveedor: yup.string().required('Rut del proveedor requerido'),
  fecha_entrega: yup.date().nullable().transform((value, originalValue) => {return originalValue==='' ? null : value}).required('Fecha de despacho requerida'),
  observacion: yup.string(),
  producto: yup.string().required('Producto requerido'),
  cantidad: yup.string().required('Cantidad requerida'),
  unidad_medida: yup.string().required('Unidad de medida requerida'),
});

export const usePrimasForm = (onSubmit) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: {  
       razon_social: '',
       codigo: '',
       rut_proveedor: '',
       fecha_entrega: '',
       observacion: '',
       producto: '',
       cantidad: '',
       unidad_medida: '',
    }
  });

  const handleSubmit = methods.handleSubmit((data) => {
    
    onSubmit(data);
    
  });

  return {
    ...methods,
    onSubmit: handleSubmit,
  };
};


