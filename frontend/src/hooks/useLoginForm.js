import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  username: yup.string().required('Nombre de usuario requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
});

export const useLoginForm = (onSubmit) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onTouched',
  });

  return {
    ...methods,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};
