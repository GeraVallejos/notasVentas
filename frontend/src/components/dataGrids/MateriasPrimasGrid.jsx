import { format, parseISO } from "date-fns";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../utils/api";
import { exportExcel } from "../../utils/exportExcel";
import CustomToolBar from "../common/CustomToolbar";
import ConfirmDialog from "../common/ConfirmDialog"; // <-- tu componente de confirmación
import { Box, CircularProgress, Typography, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

    const onExport = () => {
        const columnsToExport = columns.filter((c) => !c.disableExport);
        exportExcel(columnsToExport, materiasPrimas, exportNombre);
    };

    const handleOpenConfirm = (row) => {
        setPedidoSeleccionado(row);
        setConfirmOpen(true);
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
        { field: "nombre_producto", headerName: "Producto", width: 200 },
        { field: "cantidad", headerName: "Cantidad", width: 100 },
        { field: "unidad_medida", headerName: "Unidad de Medida", width: 150 },
        { field: "fecha_entrega", headerName: "Fecha Entrega", width: 140 },
        { field: "fecha_creacion", headerName: "Fecha Creación", width: 120 },
        { field: "fecha_modificacion", headerName: "Fecha Modificación", width: 180 },
        { field: "observacion", headerName: "Observación", width: 200, disableExport: true },
        { field: "estado", headerName: "Estado", width: 110 },

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
                rowsPerPageOptions={[10, 20, 50]}
                disableSelectionOnClick
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
            />
        </Box>
    );
};

export default MateriasPrimasGrid;
