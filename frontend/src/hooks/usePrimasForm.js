import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  fecha_entrega: yup.date().nullable().transform((value, originalValue) => {return originalValue==='' ? null : value}),
  observacion: yup.string(),
  producto: yup.string().required('Producto requerido'),
  cantidad: yup.string().required('Cantidad requerida'),
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


