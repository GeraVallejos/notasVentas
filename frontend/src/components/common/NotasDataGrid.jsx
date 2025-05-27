import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { Box, CircularProgress, Typography } from '@mui/material';
import { api } from '../../utils/api';
import CustomToolBar from './CustomToolbar';
import dataGridEs from '../../utils/dataGridEs';
import { exportExcel } from '../../utils/exportExcel';
import EditNotaModal from '../modals/EditNotaModal';

const columns = [
  { field: 'num_nota', headerName: 'N° nota', width: 80 },
  { field: 'nombre_cliente', headerName: 'Cliente', width: 200 },
  { field: 'rut_cliente', headerName: 'Rut Cliente', width: 200 },
  {
    field: 'fecha_despacho',
    headerName: 'Fecha Despacho',
    width: 165,
    editable: true,
    valueFormatter: (params) => format(new Date(params), 'dd/MM/yyyy')
  },
  { field: 'contacto', headerName: 'Contacto', width: 150 },
  { field: 'telefono', headerName: 'Teléfono', width: 110 },
  { field: 'direccion', headerName: 'Dirección', width: 120 },
  { field: 'comuna', headerName: 'Comuna', width: 120 },
  { field: 'observacion', headerName: 'Observación', width: 120 },
  { field: 'horario_desde', headerName: 'Horario Desde', width: 120 },
  { field: 'horario_hasta', headerName: 'Horario hasta', width: 120 },
  {
    field: 'fecha_creacion',
    headerName: 'Fecha Creacion',
    width: 120,
    editable: true,
    valueFormatter: (params) => format(new Date(params), 'dd/MM/yyyy')
  },
  { field: 'estado_solicitud', headerName: 'Estado', width: 115 },
  { field: 'usuario_creador', headerName: 'Usuario Creación', width: 115 },
  { field: 'usuario_modificador', headerName: 'Usuario Modificación', width: 115 },
  {
    field: 'fecha_modificacion',
    headerName: 'Fecha Modificación',
    width: 120,
    editable: true,
    valueFormatter: (params) => format(new Date(params), 'dd/MM/yyyy')
  },
];



const NotasDataGrid = () => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [notaSeleccionada, setNotaSeleccionada] = useState(null);

  const handleRowClick = (params) => {
    setNotaSeleccionada(params.row);
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    // Vuelve a cargar las notas luego de guardar
    const res = await api.get('/nota/');
    setNotas(res.data);
  };

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const res = await api.get('/nota/');
        setNotas(res.data);
      } catch (error) {
        console.error('Error al obtener las notas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotas();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const onExport = () => exportExcel(columns, notas, 'Notas de Venta.xlsx')

  return (
    <Box sx={{ height: '80vh', width: '78.5vw', marginLeft: 2 }}>
      <Typography variant="h5" gutterBottom>
        Lista de Notas
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
        initialState={{
          sorting: {
            sortModel: [{ field: 'fecha_despacho', sort: 'asc' }],
          },
          columns: {
            columnVisibilityModel: {
              rut_cliente: false,
              usuario_creador: false,
              usuario_modificador: false,
              fecha_modificacion: false,
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
    </Box>
  );
};

export default NotasDataGrid;
