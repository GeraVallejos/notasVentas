import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { Box, CircularProgress, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import { api } from '../../utils/api';
import CustomToolBar from './CustomToolbar';
import dataGridEs from '../../utils/dataGridEs';
import { exportExcel } from '../../utils/exportExcel';
import EditNotaModal from '../modals/EditNotaModal';
import ConfirmDialog from './ConfirmDialog';



const NotasDataGrid = ({ estado, nombre, exportNombre, userGroups }) => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [notaSeleccionada, setNotaSeleccionada] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const esVentas = userGroups?.includes('Ventas');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notaToDelete, setNotaToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();


  const baseColumns = [
    { field: 'num_nota', headerName: 'N° nota', width: 80 },
    { field: 'razon_social', headerName: 'Razón Social', width: 200 },
    { field: 'rut_cliente', headerName: 'Rut Cliente', width: 200 },
    {
      field: 'fecha_despacho',
      headerName: 'Fecha Despacho',
      width: 165,
      editable: true,
      valueFormatter: (params) => format(new Date(params), 'dd/MM/yyyy')
    },
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
    { field: 'horario_hasta', headerName: 'Horario hasta', width: 120 },
    {
    field: 'fecha_creacion_date',
    headerName: 'Fecha Creación',
    width: 120,
    valueFormatter: (params) => format(new Date(params), 'dd/MM/yyyy')
  },
  {
    field: 'fecha_creacion_time',
    headerName: 'Hora Creación',
    width: 100,
    valueFormatter: (params) => format(new Date(params), 'HH:mm')
  },
    { field: 'estado_solicitud', headerName: 'Estado', width: 115 },
    { field: 'usuario_creador', headerName: 'Usuario Creación', width: 115 },
    { field: 'usuario_modificador', headerName: 'Usuario Modificación', width: 115 },
    {
    field: 'fecha_modificacion_date',
    headerName: 'Fecha Modif.',
    width: 120,
    valueFormatter: (params) => format(new Date(params), 'dd/MM/yyyy')
  },
  {
    field: 'fecha_modificacion_time',
    headerName: 'Hora Modif.',
    width: 100,
    valueFormatter: (params) => format(new Date(params), 'HH:mm')
  },
  ];

  const handleRowClick = (params) => {
    setNotaSeleccionada(params.row);
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    try {
      const res = await api.get('/nota/');
      const dataFilter = res.data.filter(res => res.estado_solicitud === estado);
      setNotas(dataFilter);
      enqueueSnackbar('Nota guardada correctamente', { variant: 'success' });
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Error al cargar notas después de guardar', { variant: 'error' });
    }
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
      setNotas((prev) => prev.filter(n => n.id_nota !== id));
      enqueueSnackbar('Nota borrada correctamente', { variant: 'success' });
    } catch (error) {
      console.error('Error al borrar la nota:', error);
      enqueueSnackbar('Error al borrar la nota', { variant: 'error' });
    } finally {
      setDeletingId(null);
      setNotaToDelete(null);
    }
  };

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const res = await api.get('/nota/');
        const dataFilter = res.data.filter(res => res.estado_solicitud === estado)
        .map(nota => ({
          ...nota,
          fecha_creacion_date: nota.fecha_creacion, // Para fecha
          fecha_creacion_time: nota.fecha_creacion, // Para hora
          fecha_modificacion_date: nota.fecha_modificacion, // Si también quieres separar modificación
          fecha_modificacion_time: nota.fecha_modificacion
        }));
        setNotas(dataFilter);
      } catch (error) {
        console.error('Error al obtener las notas:', error);
        enqueueSnackbar('Error al cargar las notas', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchNotas();
  }, [estado, enqueueSnackbar]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={30}>
        <CircularProgress />
      </Box>
    );
  }

  const deleteColumn = {
    field: 'delete',
    headerName: 'Eliminar',
    headerAlign: 'center',
    width: 80,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
        <Tooltip title="Borrar nota" >
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

  const onExport = () => exportExcel(columns, notas, exportNombre);

  const columns = esVentas ? baseColumns : [...baseColumns, deleteColumn];

  return (
    <Box sx={{ height: '80vh', width: '83.5vw', marginLeft: 2 }}>
      <Typography variant="h5" gutterBottom>
        {nombre}
      </Typography>
      <DataGrid
        rows={notas}
        columns={columns}
        getRowId={(row) => row.id_nota}
        pageSize={10}
        density="compact"
        rowsPerPageOptions={[10, 25, 50]}
        onRowDoubleClick={handleRowClick}
        slots={{ toolbar: CustomToolBar }}
        showToolbar
        slotProps={{ toolbar: { onExport } }}
        localeText={dataGridEs}
        sx={{
          userSelect: 'none',
        }}
        initialState={{
          sorting: {
            sortModel: [{ field: 'fecha_despacho', sort: 'asc' }],
          },
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
        content={`¿Estás seguro que quieres borrar la nota n° ${notaToDelete?.nota}?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default NotasDataGrid;
