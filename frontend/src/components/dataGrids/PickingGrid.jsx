import { useCallback, useEffect, useState } from "react"
import { api } from "../../utils/api";
import { format, parseISO } from "date-fns";
import { useSnackbar } from "notistack";
import { exportExcel } from "../../utils/exportExcel";
import { DataGrid } from "@mui/x-data-grid";
import { Box, CircularProgress, Typography, IconButton, Tooltip, Select, MenuItem, FormControl } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CustomToolBar from "../common/CustomToolbar";
import ConfirmDialog from "../common/ConfirmDialog";
import dataGridEs from "../../utils/dataGridEs";
import PickingModal from "../modals/PickingModal";


const formatearPicking = (picking) => ({
    ...picking,
    fecha_creacion: picking.fecha_creacion ? format(parseISO(picking.fecha_creacion), 'dd/MM/yyyy') : '',
    razon_social_cliente: picking.nota?.cliente?.razon_social || '',
    producto_nombre: picking.producto?.nombre || '',
    nota: picking.nota?.num_nota || null,
    fecha_despacho: picking.nota?.fecha_despacho ? format(parseISO(picking.nota.fecha_despacho), 'dd/MM/yyyy') : '',
    fecha_modificacion: picking.fecha_modificacion ? format(parseISO(picking.fecha_modificacion), 'dd/MM/yyyy') : '',
    estado_solicitud: picking.nota?.estado_solicitud || '',
    id_nota: picking.nota?.id_nota || null,
    fecha_creacion_time: picking.fecha_creacion || ''
        ? format(parseISO(picking.fecha_creacion), 'HH:mm')
        : '',
});


const PickingGrid = ({ estado, nombre, exportNombre, userGroup }) => {

    const [pickingData, setPickingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pedidoToDelete, setPedidoToDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [productos, setProductos] = useState([]);
    const esVentas = userGroup.includes('Ventas');



    const fetchPickingData = useCallback(async () => {
        try {
            const res = await api.get('/notas_productos/');
            const resFiltradas = res.data
                .filter((p) => estado.includes(p.estado))
                .map(formatearPicking);
            setPickingData(resFiltradas);
        } catch (error) {
            console.error('Error al obtener los datos de picking:', error);
            enqueueSnackbar('Error al cargar los datos de picking', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [estado, enqueueSnackbar]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await api.get("/productos/");
                setProductos(res.data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
                enqueueSnackbar("Error al cargar productos", { variant: "error" });
            }
        };
        fetchProductos();
    }, [enqueueSnackbar]);

    useEffect(() => {
        fetchPickingData();
    }, [fetchPickingData]);

    const handleOpenModal = (pedido) => {

        if (!pedido || !productos.length) return;

        const producto = productos.find(
            p => p.id_producto === pedido.id_producto ||
                p.nombre === pedido.nombre_producto
        );

        if (!producto) return;

        setPedidoSeleccionado(pedido);
        setProductoSeleccionado(producto);
        setModalOpen(true);
    };

    console.log(pedidoSeleccionado)

    const handleDeleteRequest = (id) => {
        setPedidoToDelete(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        const id = pedidoToDelete;
        setConfirmOpen(false);
        try {
            setDeletingId(id);
            await api.delete(`/notas_productos/${id}/`);
            setPickingData(prev => prev.filter(n => n.id !== id));
            enqueueSnackbar('Pedido borrado correctamente', { variant: 'success' });
        } catch (error) {
            console.error('Error al borrar el pedido:', error);
            enqueueSnackbar('Error al borrar el pedido', { variant: 'error' });
        } finally {
            setDeletingId(null);
            setPedidoToDelete(null);
        }
    };

    const estadoOptions = ['RECIBIDO', 'PENDIENTE', 'TERMINADO', 'PREPARANDO', 'ENVIADO', 'GUIA'];

    const estadoColors = {
        RECIBIDO: { bg: '#d1e7dd', color: '#0f5132' },
        PENDIENTE: { bg: '#fde2e4', color: '#842029' },
        TERMINADO: { bg: '#d2e7c9ff', color: '#369808ff' },
        PREPARANDO: { bg: '#ebf3c0ff', color: '#525a09ff' },
        ENVIADO: { bg: '#c7d5fcff', color: '#204084ff' },
        GUIA: { bg: '#e6a1f0ff', color: '#6d058dff' },
    };

    const baseColumns = [
        { field: 'nota', headerName: 'Nota', width: 70 },
        { field: 'razon_social_cliente', headerName: 'Cliente', width: 200 },
        { field: 'producto_nombre', headerName: 'Producto', width: 350 },
        { field: 'cantidad', headerName: 'Cantidad', width: 80 },
        { field: 'fecha_despacho', headerName: 'Fecha Despacho', width: 150 },
        { field: 'tipo', headerName: 'Local', width: 85 },
        { field: 'fecha_creacion', headerName: 'Fecha Creación', width: 110 },
        { field: 'fecha_creacion_time', headerName: 'Hora', width: 60 },
        { field: 'usuario_creador', headerName: 'Usuario Creador', width: 150 },
        { field: 'usuario_modificador', headerName: 'Usuario Modificador', width: 150 },
        { field: 'fecha_modificacion', headerName: 'Fecha Modificación', width: 150 },
        { field: 'observacion', headerName: 'Observación', width: 150 },
        {
            field: 'estado',
            headerName: 'Estado',
            width: 160,
            renderCell: (params) => {

                const current = params.row?.estado || '';

                return (
                    <FormControl
                        variant="standard"
                        size="small"
                        sx={{ width: '100%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Select
                            value={current}
                            sx={{
                                backgroundColor: estadoColors[current]?.bg,
                                color: estadoColors[current]?.color,
                                pl: 1,
                                fontSize: 13,
                                borderRadius: 1,
                                '.MuiSvgIcon-root': { color: estadoColors[current]?.color },
                            }}
                            onChange={async (e) => {
                                e.stopPropagation();
                                const newVal = e.target.value;

                                try {
                                    await api.patch(`/notas_productos/${params.row.id}/`, {
                                        estado: newVal,
                                    });
                                    setPickingData((prev) =>
                                        prev.map((r) =>
                                            r.id === params.row.id ? { ...r, estado: newVal } : r
                                        )
                                    );
                                    enqueueSnackbar('Estado actualizado', { variant: 'success' });
                                } catch (error) {
                                    console.error('Error al actualizar estado:', error);
                                    enqueueSnackbar('Error al actualizar estado', { variant: 'error' });
                                }
                            }}
                        >
                            {estadoOptions.map((opt) => {
                                const colors = estadoColors[opt] || {};
                                return (
                                    <MenuItem
                                        key={opt}
                                        value={opt}
                                        sx={{
                                            backgroundColor: colors.bg,
                                            color: colors.color,
                                            pl: 2,
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                backgroundColor: `${colors.bg}CC`
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: colors.bg,
                                                color: colors.color,
                                            },
                                            '&.Mui-selected:hover': {
                                                backgroundColor: `${colors.bg}CC`,
                                            },
                                        }}
                                    >
                                        {opt}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                );
            },
        },
    ];


    const deleteColumn = {
        field: 'delete',
        headerName: 'Eliminar',
        headerAlign: 'center',
        width: 80,
        sortable: false,
        filterable: false,
        disableExport: true,
        renderCell: (params) => (
            <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                <Tooltip title="Borrar nota">
                    <IconButton
                        color="error"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRequest(params.row.id);
                        }}
                        disabled={deletingId === params.row.id}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
    };


    const columns = esVentas ? baseColumns : [...baseColumns, deleteColumn];

    const onExport = () => {
        const columnsToExport = columns.filter(column => !column.disableExport);
        exportExcel(columnsToExport, pickingData, exportNombre);
    };


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
                rows={pickingData}
                columns={columns}
                getRowId={(row) => row.id}
                pageSize={10}
                density="compact"
                rowsPerPageOptions={[10, 25, 50]}
                onRowDoubleClick={(params) => handleOpenModal(params.row)}
                slots={{ toolbar: CustomToolBar }}
                slotProps={{ toolbar: { onExport } }}
                showToolbar
                getRowHeight={() => 30}
                localeText={dataGridEs}
                sx={{
                    fontSize: 13,
                    userSelect: 'none',
                }}
                initialState={{
                    sorting: { sortModel: [{ field: 'fecha_despacho', sort: 'asc' }] }
                }}
                columnVisibilityModel={{

                    usuario_creador: false,
                    usuario_modificador: false,
                    fecha_modificacion: false,
                }}
            />
            <ConfirmDialog
                open={confirmOpen}
                title="Esta acción no se puede deshacer"
                content={`¿Seguro que quieres borrar el pedido?`}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
            />
            {modalOpen && productoSeleccionado && (
                <PickingModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    pedido={pedidoSeleccionado}
                    onUpdated={fetchPickingData}
                    productoSeleccionado={productoSeleccionado}
                />
            )}
        </Box>

    )
}

export default PickingGrid