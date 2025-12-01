import { format, parseISO } from "date-fns";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../utils/api";
import { exportExcel } from "../../utils/exportExcel";
import CustomToolBar from "../common/CustomToolbar";
import ConfirmDialog from "../common/ConfirmDialog";
import { Box, CircularProgress, Typography, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MateriasPrimasModal from "../modals/MateriasPrimasModal";
import DeleteIcon from '@mui/icons-material/Delete';

const formatearPrima = (materiasPrimas) => ({
    ...materiasPrimas,
    fecha_entrega: materiasPrimas.fecha_entrega
        ? format(parseISO(materiasPrimas.fecha_entrega), "dd/MM/yyyy")
        : "",
    fecha_creacion: materiasPrimas.fecha_creacion
        ? format(parseISO(materiasPrimas.fecha_creacion), "dd/MM/yyyy")
        : "",
    fecha_modificacion: materiasPrimas.fecha_modificacion
        ? format(parseISO(materiasPrimas.fecha_modificacion), "dd/MM/yyyy")
        : "",
});

const MateriasPrimasGrid = ({ nombre, exportNombre, estado }) => {
    const [materiasPrimas, setMateriasPrimas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [pedidoToDelete, setPedidoToDelete] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmOpenDelete, setConfirmOpenDelete] = useState(false);
    const [productos, setProductos] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const fetchMateriasPrimas = useCallback(async () => {
        try {
            const res = await api.get("/pedido_materias_primas/");
            const filtradas = res.data
                .filter((n) => n.estado === estado)
                .map(formatearPrima);
            setMateriasPrimas(filtradas);
        } catch (error) {
            console.error("Error al obtener las materias primas:", error);
            enqueueSnackbar("Error al cargar las materias primas", {
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar, estado]);

    useEffect(() => {
        fetchMateriasPrimas();
    }, [fetchMateriasPrimas]);

    // Cargar productos
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


    const onExport = () => {
        const columnsToExport = columns.filter((c) => !c.disableExport);
        exportExcel(columnsToExport, materiasPrimas, exportNombre);
    };

    const handleOpenConfirm = (pedido) => {
        setPedidoSeleccionado(pedido);
        setConfirmOpen(true);
    };

    const handleOpenModal = (pedido) => {
        console.log("Pedido recibido:", pedido);
    console.log("Productos:", productos);
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

    const handleDeleteRequest = (id) => {
        setPedidoToDelete(id);
        setConfirmOpenDelete(true);
    };

    const handleConfirmDelete = async () => {
        const id = pedidoToDelete;
        setConfirmOpenDelete(false);
        try {
            setDeletingId(id);
            await api.delete(`/pedido_materias_primas/${id}/`);
            setMateriasPrimas(prev => prev.filter(n => n.id_pedido !== id));
            enqueueSnackbar('Pedido borrado correctamente', { variant: 'success' });
        } catch (error) {
            console.error('Error al borrar el pedido:', error);
            enqueueSnackbar('Error al borrar el pedido', { variant: 'error' });
        } finally {
            setDeletingId(null);
            setPedidoToDelete(null);
        }
    };

    const handleConfirm = async () => {
        try {
            await api.patch(`/pedido_materias_primas/${pedidoSeleccionado.id_pedido}/`, {
                estado: "SOLICITADO",
            });
            enqueueSnackbar("Pedido actualizado a 'Solicitado'", { variant: "success" });
            setConfirmOpen(false);
            fetchMateriasPrimas(); // refresca la grilla
        } catch (error) {
            console.error("Error al actualizar el pedido:", error);
            enqueueSnackbar("Error al actualizar el pedido", { variant: "error" });
        }
    };


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={30}>
                <CircularProgress />
            </Box>
        );
    }

    const baseColumns = [
        { field: "id_pedido", headerName: "ID Pedido", width: 80 },
        { field: "rut_proveedor", headerName: "RUT Proveedor", width: 120 },
        { field: "nombre_proveedor", headerName: "Razón Social", width: 200 },
        { field: "codigo_producto", headerName: "Código Producto", width: 200 },
        { field: "nombre_producto", headerName: "Producto", width: 350 },
        { field: "cantidad", headerName: "Cantidad", width: 80 },
        { field: "unidad_medida", headerName: "Unidad de Medida", width: 150 },
        { field: "fecha_entrega", headerName: "Fecha Entrega", width: 140 },
        { field: "fecha_creacion", headerName: "Fecha Creación", width: 120 },
        { field: "fecha_modificacion", headerName: "Fecha Modificación", width: 180 },
        { field: "observacion", headerName: "Observación", width: 200, disableExport: true },
        { field: "estado", headerName: "Estado", width: 110 },
        {
            field: 'delete',
            headerName: 'Eliminar',
            headerAlign: 'center',
            width: 80,
            sortable: false,
            filterable: false,
            disableExport: true,
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
                    <Tooltip title="Borrar Pedido">
                        <IconButton
                            color="error"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRequest(params.row.id_pedido);
                            }}
                            disabled={deletingId === params.row.id_pedido}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        }

    ];

    const accionesColumn = {
        field: "acciones",
        headerName: "Solicitar",
        align: "center",
        headerAlign: "center",
        disableExport: true,
        width: 80,
        renderCell: (params) => (
            <IconButton
                color="success"
                onClick={() => handleOpenConfirm(params.row)}
                disabled={params.row.estado === "SOLICITADO"}
            >
                <CheckCircleIcon />
            </IconButton>
        ),
    };

    const mostrarAcciones = materiasPrimas.some((mp) => mp.estado !== "SOLICITADO");

    const columns = mostrarAcciones ? [...baseColumns, accionesColumn] : baseColumns;

    return (
        <Box sx={{ height: "80vh", width: "83.5vw", marginLeft: 1 }}>
            <Typography variant="h5" gutterBottom>
                {nombre}
            </Typography>
            <DataGrid
                rows={materiasPrimas}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.id_pedido}
                pageSize={10}
                slots={{ toolbar: CustomToolBar }}
                slotProps={{ toolbar: { onExport } }}
                showToolbar
                onRowDoubleClick={(params) => handleOpenModal(params.row)}
                rowsPerPageOptions={[10, 20, 50]}
                sx={{
                    userSelect: 'none',
                    fontSize: 13,
                }}
                initialState={{
                    sorting: { sortModel: [{ field: "fecha_entrega", sort: "asc" }] },
                    columns: {
                        columnVisibilityModel: {
                            id_pedido: false,
                            usuario_creador: false,
                            usuario_modificador: false,
                            fecha_modificacion: false,
                            codigo_producto: false,
                        },
                    },
                }}
            />

            <ConfirmDialog
                open={confirmOpen}
                title="Pedido Solicitado"
                content={`¿Deseas cambiar el estado del pedido ${pedidoSeleccionado?.nombre_producto} a 'SOLICITADO'?`}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
                pedido={productos}
            />

            <ConfirmDialog
                open={confirmOpenDelete}
                title="Esta acción no se puede deshacer"
                content={`¿Seguro que quieres borrar el pedido?`}
                onClose={() => setConfirmOpenDelete(false)}
                onConfirm={handleConfirmDelete}
            />
            {modalOpen && pedidoSeleccionado && productos && (
                <MateriasPrimasModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    pedido={pedidoSeleccionado}
                    onUpdated={fetchMateriasPrimas}
                    productoSeleccionado={productoSeleccionado}
                />
            )}
        </Box>
    );
};

export default MateriasPrimasGrid;
