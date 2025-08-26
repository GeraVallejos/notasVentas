import { useSnackbar } from "notistack";
import { usePrimasForm } from "../../hooks/usePrimasForm";
import { api } from "../../utils/api";
import { formatearRut } from "../../utils/formatearRut";
import { format, isValid, parseISO } from "date-fns";
import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { Controller, FormProvider } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchSelect from "../common/SearchSelect";


const MPrimasForm = () => {

  const { enqueueSnackbar } = useSnackbar();


  // Funcion para dejar los strigs de la data en mayus, con exepciones
  const transformMayus = (obj, excluir = []) => {
    const nuevoObj = { ...obj };
    for (const key in nuevoObj) {
      if (typeof nuevoObj[key] === 'string' && !excluir.includes(key)) {
        nuevoObj[key] = nuevoObj[key].toUpperCase();
      }
    }
    return nuevoObj;
  };

  const form = usePrimasForm(async (data) => {
    try {
      // Primero verificamos proveedor y producto
      const [proveedorResponse, productoResponse] = await Promise.all([
        api.get('proveedores/por-rut', { params: { rut: data.rut_proveedor } }),
        api.get('productos/por-codigo', { params: { codigo: data.codigo } })
      ]);

      const proveedor = proveedorResponse.data;
      const producto = productoResponse.data;

      const payload = {
        id_proveedor: proveedor.id_proveedor,
        id_producto: producto.id_producto,
        cantidad: data.cantidad,
        unidad_medida: data.unidad_medida,
        fecha_entrega: data.fecha_entrega,
        observacion: data.observacion,
      };

      await api.post('/pedido_materias_primas/', transformMayus(payload));
      enqueueSnackbar('Pedido creado con éxito', { variant: 'success' });

      form.reset();

    } catch (error) {
      console.error(error);
      if (error.response?.status === 404) {
        if (error.config.url.includes('proveedores')) {
          enqueueSnackbar('Proveedor no encontrado', { variant: 'error' });
        } else {
          enqueueSnackbar('Producto no encontrado', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Error al crear el pedido', { variant: 'error' });
      }
    }
  });

  const handleChangeRut = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatearRut(rawValue);
    form.setValue('rut_proveedor', formattedValue, { shouldValidate: true });
  };

  const handleBlurRut = async (e) => {
    const rutFormateado = e.target.value;
    if (!rutFormateado) return;

    try {
      const { data } = await api.get('/proveedores/por-rut/', {
        params: { rut: rutFormateado },
      });
      form.setValue('rut_proveedor', data.rut_proveedor || '');
      form.setValue('razon_social', data.razon_social || '');
      form.setValue('id_proveedor', data.id_proveedor || '');

    } catch (error) {
      console.error(error);
      form.setValue('rut_proveedor', '');
      form.setValue('razon_social', '');
      enqueueSnackbar('Proveedor no encontrado', { variant: 'warning' });
    }
  };

  const handleBlurProducto = async (e) => {
    const codigoProducto = e.target.value;
    if (!codigoProducto) return;
    try {
      const { data } = await api.get('/productos/por-codigo/', {
        params: { codigo: codigoProducto },
      });
      form.setValue('codigo', data.codigo || '');
      form.setValue('producto', data.nombre || '');
      form.setValue('unidad_medida', data.unidad_medida || '');
      form.setValue('id_producto', data.id_producto || '');
    } catch (error) {
      console.error(error);
      form.setValue('codigo', '');
      form.setValue('producto', '');
      form.setValue('unidad_medida', '');
      form.setValue('id_producto', '');
      enqueueSnackbar('Producto no encontrado', { variant: 'warning' });
    }
  };


  const handleSubmitPrima = (e) => {
    e.preventDefault();
    form.onSubmit();
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto', mt: 2, px: 4, py: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 2, background: ' #00BFFF', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        FORMULARIO INSUMOS
      </Typography>

      <FormProvider {...form}>
        <form onSubmit={handleSubmitPrima} noValidate>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Controller
                  name="rut_proveedor"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Rut proveedor"
                      autoCorrect="off"
                      autoComplete="off"
                      onChange={handleChangeRut}
                      onBlur={handleBlurRut}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{
                        shrink: !!field.value
                      }}
                    />
                  )}
                />
                <Controller name="codigo" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Código" fullWidth autoCorrect="off" autoComplete="off" onBlur={handleBlurProducto} error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <Controller name="unidad_medida" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Unidad" fullWidth autoCorrect="off" autoComplete="off" error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <DatePicker
                  label="Fecha de Entrega"
                  value={
                    form.watch("fecha_entrega")
                      ? parseISO(form.watch("fecha_entrega"))
                      : null
                  }
                  onChange={(date) =>
                    form.setValue(
                      "fecha_entrega",
                      isValid(date) ? format(date, "yyyy-MM-dd") : ""
                    )
                  }
                  format="dd/MM/yyyy"
                  minDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!form.formState.errors.fecha_entrega,
                      helperText: form.formState.errors.fecha_entrega?.message,
                    },
                  }}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <SearchSelect
                  name="razon_social"
                  control={form.control}
                  label="Razón Social"
                  endpoint="/pedido_materias_primas/buscar-proveedores"
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.razon_social
                  }
                  onSelect={(value) => {
                    if (value) {
                      form.setValue("rut_proveedor", value.rut_proveedor);
                      form.setValue("id_proveedor", value.id_proveedor);
                    } else {
                      form.setValue("rut_proveedor", "");
                      form.setValue("id_proveedor", "");
                    }
                  }}
                />

                <SearchSelect
                  name="producto"
                  control={form.control}
                  label="Producto"
                  endpoint="/pedido_materias_primas/buscar-productos"
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.nombre
                  }
                  onSelect={(value) => {
                    if (value) {
                      form.setValue("codigo", value.codigo);
                      form.setValue("unidad_medida", value.unidad_medida);
                      form.setValue("id_producto", value.id_producto);
                    } else {
                      form.setValue("codigo", "");
                      form.setValue("unidad_medida", "");
                      form.setValue("id_producto", "");
                    }
                  }}
                />
                <Controller name="cantidad" type="number" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Cantidad" fullWidth autoCorrect="off" autoComplete="off" error={!!fieldState.error} helperText={fieldState.error?.message} />} />
                <Controller name="observacion" control={form.control} render={({ field, fieldState }) => <TextField {...field} label="Observación" multiline fullWidth autoCorrect="off" autoComplete="off" rows={1} InputLabelProps={{ shrink: !!field.value }} error={!!fieldState.error} helperText={fieldState.error?.message} />} />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <Button type="submit" variant="contained" fullWidth disabled={form.formState.isSubmitting} sx={{ mt: 2, background: ' #00BFFF', color: 'white', fontSize: '1rem', '&:hover': { background: '#1C86EE' } }}>
                {form.formState.isSubmitting ? 'Guardando...' : 'PEDIR INSUMOS'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Box>
  )

}

export default MPrimasForm