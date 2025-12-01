import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useSnackbar } from "notistack";

const schema = yup.object().shape({
  producto: yup.object().required("Selecciona un producto"),
  cantidad: yup
    .number()
    .typeError("Debe ser un número")
    .positive("Debe ser mayor a 0")
    .required("Campo obligatorio"),
  observacion: yup.string().nullable(),
});

const PickingModal = ({ open, onClose, pedido, onUpdated, productos }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);


  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      producto: null,
      cantidad: 0,
      tipo: "",
      observacion: "",
    },
  });

  const transformMayus = (obj, excluir = []) => {
    const nuevoObj = { ...obj };
    for (const key in nuevoObj) {
      if (typeof nuevoObj[key] === 'string' && !excluir.includes(key)) {
        nuevoObj[key] = nuevoObj[key].toUpperCase();
      }
    }
    return nuevoObj;
  };

  // Reset al abrir modal
  useEffect(() => {

    
    reset({
      producto: pedido.nombre || null,
      cantidad: pedido.cantidad || 0,
      tipo: pedido.tipo || "",
      observacion: pedido.observacion || "",
    });
  }, [pedido, reset]);

  // 🔹 Guardar cambios
  const onSubmit = async (data) => {
    if (!pedido?.id) return;
    const payload = {
      producto_id: data.producto.id_producto,
      cantidad: data.cantidad,
      tipo: data.tipo,
      observacion: data.observacion
    };
    try {
      setSaving(true);

      await api.patch(`/notas_productos/${pedido.id}/`, transformMayus(payload));
      enqueueSnackbar("Pedido actualizado correctamente", { variant: "success" });
      if (onUpdated) onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      if (error.response?.data?.non_field_errors?.[0]?.includes('conjunto único')) {
        enqueueSnackbar('Este producto ya existe en la nota', { variant: 'warning' });
      } else {
        enqueueSnackbar('Error al actualizar el producto', { variant: 'error' });
      }
    } finally {
      setSaving(false);
    }
  };

  if (!pedido) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Editar Pedido #{pedido.nota || pedido.id}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Cliente */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Cliente
            </Typography>
            <Typography>{pedido.razon_social_cliente}</Typography>
          </Grid>

          {/* Nota */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Nº Nota
            </Typography>
            <Typography>{pedido.nota}</Typography>
          </Grid>

          {/* Producto */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="producto"
              control={control}
              render={({ field, fieldState }) => (
                <Autocomplete
                  {...field}
                  options={productos}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.nombre
                  }
                  isOptionEqualToValue={(opt, val) => opt.id === val?.id}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Producto"
                      size="small"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>

          {/* Cantidad */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="cantidad"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Cantidad"
                  size="small"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          {/* Observación */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="observacion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Observación"
                  fullWidth
                  size="small"
                  multiline
                  rows={1}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="tipo"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Local"
                  fullWidth
                  size="small"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                >
                  <MenuItem value="">Seleccione una opción</MenuItem>
                  <MenuItem value="FRANKLIN">Franklin</MenuItem>
                  <MenuItem value="STOCK">Stock</MenuItem>
                  <MenuItem value="TIENDA">Tienda</MenuItem>
                </TextField>
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={18} /> : null}
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PickingModal;
