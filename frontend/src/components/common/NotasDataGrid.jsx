import { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import { api } from '../../utils/api';
import CustomToolBar from './CustomToolbar';
import dataGridEs from '../../utils/dataGridEs';
import { exportExcel } from '../../utils/exportExcel';
import EditNotaModal from '../modals/EditNotaModal';
import ConfirmDialog from './ConfirmDialog';

// 🔁 Función para transformar una nota en formato listo para el grid
const formatearNota = (nota) => ({
  ...nota,
  fecha_creacion_date: nota.fecha_creacion,
  fecha_creacion_time: nota.fecha_creacion,
  fecha_modificacion_date: nota.fecha_modificacion,
  fecha_modificacion_time: nota.fecha_modificacion,
  horario_desde: typeof nota.horario_desde === 'string' ? nota.horario_desde : '',
  horario_hasta: typeof nota.horario_hasta === 'string' ? nota.horario_hasta : '',
});

const NotasDataGrid = ({ estado, nombre, exportNombre, userGroups }) => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [notaSeleccionada, setNotaSeleccionada] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notaToDelete, setNotaToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const esVentas = userGroups?.includes('Ventas');

  const fetchNotas = useCallback(async () => {
    try {
      const res = await api.get('/nota/');
      const filtradas = res.data
        .filter(n => n.estado_solicitud === estado)
        .map(formatearNota);
      setNotas(filtradas);
    } catch (error) {
      console.error('Error al obtener las notas:', error);
      enqueueSnackbar('Error al cargar las notas', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [estado, enqueueSnackbar]);

  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);

  const handleGuardar = async () => {
    try {
      await fetchNotas();
      enqueueSnackbar('Nota guardada correctamente', { variant: 'success' });
    } catch {
      enqueueSnackbar('Error al cargar notas después de guardar', { variant: 'error' });
    }
  };

  const handleRowClick = (params) => {
    setNotaSeleccionada(params.row);
    setModalOpen(true);
  };

  const handleDeleteRequest = (id, nota) => {
    setNotaToDelete({ id, nota });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const { id } = notaToDelete;
    setConfirmOpen(false);
    try {
      setDeletingId(id);
      await api.delete(`/nota/${id}/`);
      setNotas(prev => prev.filter(n => n.id_nota !== id));
      enqueueSnackbar('Nota borrada correctamente', { variant: 'success' });
    } catch (error) {
      console.error('Error al borrar la nota:', error);
      enqueueSnackbar('Error al borrar la nota', { variant: 'error' });
    } finally {
      setDeletingId(null);
      setNotaToDelete(null);
    }
  };

  const baseColumns = [
    { field: 'num_nota', headerName: 'N° nota', width: 80 },
    { field: 'razon_social', headerName: 'Razón Social', width: 200 },
    { field: 'rut_cliente', headerName: 'Rut Cliente', width: 200 },
    { field: 'fecha_despacho', headerName: 'Fecha Despacho', width: 165 },
    { field: 'contacto', headerName: 'Contacto', width: 150 },
    { field: 'correo', headerName: 'Correo', width: 150 },
    { field: 'telefono', headerName: 'Teléfono', width: 110 },
    { field: 'direccion', headerName: 'Dirección', width: 120 },
    { field: 'comuna', headerName: 'Comuna', width: 120 },
    { field: 'ciudad', headerName: 'Ciudad', width: 120 },
    { field: 'region', headerName: 'Region', width: 120 },
    { field: 'despacho_retira', headerName: 'Tipo Despacho', width: 120 },
    { field: 'observacion', headerName: 'Observación', width: 120 },
    { field: 'horario_desde', headerName: 'Horario Desde', width: 120 },
    { field: 'horario_hasta', headerName: 'Horario Hasta', width: 120 },
    { field: 'fecha_creacion_date', headerName: 'Fecha Creación', width: 120 },
    { field: 'fecha_creacion_time', headerName: 'Hora Creación', width: 100 },
    { field: 'estado_solicitud', headerName: 'Estado', width: 115 },
    { field: 'usuario_creador', headerName: 'Usuario Creación', width: 115 },
    { field: 'usuario_modificador', headerName: 'Usuario Modificación', width: 115 },
    { field: 'fecha_modificacion_date', headerName: 'Fecha Modif.', width: 120 },
    { field: 'fecha_modificacion_time', headerName: 'Hora Modif.', width: 100 },
  ];

  const deleteColumn = {
    field: 'delete',
    headerName: 'Eliminar',
    headerAlign: 'center',
    width: 80,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
        <Tooltip title="Borrar nota">
          <IconButton
            color="error"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteRequest(params.row.id_nota, params.row.num_nota);
            }}
            disabled={deletingId === params.row.id_nota}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  };

  const columns = esVentas ? baseColumns : [...baseColumns, deleteColumn];

  const onExport = () => exportExcel(columns, notas, exportNombre);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={30}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '80vh', width: '83.5vw', marginLeft: 2 }}>
      <Typography variant="h5" gutterBottom>{nombre}</Typography>
      <DataGrid
        rows={notas}
        columns={columns}
        getRowId={(row) => row.id_nota}
        pageSize={10}
        density="compact"
        rowsPerPageOptions={[10, 25, 50]}
        onRowDoubleClick={handleRowClick}
        slots={{ toolbar: CustomToolBar }}
        slotProps={{ toolbar: { onExport } }}
        localeText={dataGridEs}
        sx={{ userSelect: 'none' }}
        initialState={{
          sorting: { sortModel: [{ field: 'fecha_despacho', sort: 'asc' }] },
          columns: {
            columnVisibilityModel: {
              rut_cliente: false,
              usuario_creador: false,
              usuario_modificador: false,
              fecha_modificacion_date: false,
              fecha_modificacion_time: false,
              ciudad: false,
              region: false,
            },
          },
        }}
      />
      <EditNotaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        nota={notaSeleccionada}
        onSave={handleGuardar}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Esta acción no se puede deshacer"
        content={`¿Seguro que quieres borrar la nota n° ${notaToDelete?.nota}?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default NotasDataGrid;
