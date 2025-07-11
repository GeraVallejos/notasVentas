import * as yup from 'yup';

export const notaSchema = yup.object().shape({
  num_nota: yup.number().transform((value, originalValue) =>
    String(originalValue).trim() === '' ? undefined : value
  ).required('Número de nota requerido'),
  razon_social: yup.string().required('Nombre del cliente requerido'),
  rut_cliente: yup.string().required('Rut del cliente requerido'),
  correo: yup.string().email('Correo inválido').required('Correo requerido'),
  fecha_despacho: yup.date().required('Fecha de despacho requerida').typeError('Fecha inválida'),
  contacto: yup.string().required('Nombre de contacto requerido'),
  telefono: yup
    .string()
    .matches(/^[1-9]\d{8}$/, 'Teléfono debe tener 9 dígitos')
    .required('Teléfono requerido'),
  direccion: yup.string().required('Dirección requerida'),
  comuna: yup.string().required('Comuna requerida'),
  observacion: yup.string(),
  despacho_retira: yup.string().required('Debe elegir entre despacho o retira'),
  horario_desde: yup.string(),
  horario_hasta: yup.string(),
  estado_solicitud: yup.string().oneOf(["Solicitado", "No Solicitado"]).required("El estado es obligatorio"),
  password: yup.string().required("Contraseña requerida")
});
