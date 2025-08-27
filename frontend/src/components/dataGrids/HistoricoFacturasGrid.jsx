import { format, parseISO } from "date-fns";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../utils/api";
import { exportExcel } from "../../utils/exportExcel";
import CustomToolBar from "../common/CustomToolbar";
import ConfirmDialog from "../common/ConfirmDialog";
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import {
  PictureAsPdf,
  Download,
  Visibility,
} from "@mui/icons-material";





const formatearFacturas = (pdf) => ({
  ...pdf,
  created_at: pdf.created_at
    ? format(parseISO(pdf.created_at), "dd/MM/yyyy")
    : "",
  updated_at: pdf.updated_at
    ? format(parseISO(pdf.updated_at), "dd/MM/yyyy")
    : "",
  file_size_mb: pdf.file_size ? (pdf.file_size / (1024 * 1024)).toFixed(2) + " MB" : "",
  empresa: pdf.empresa
    ? pdf.empresa.toUpperCase()
    : "",
  observacion: pdf.observacion
    ? pdf.observacion.toUpperCase()
    : "",
});

const HistoricoFacturasGrid = ({ nombre, exportNombre, estado }) => {
  const [facturas, setfacturas] = useState([]);
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOpenPagar, setConfirmOpenPagar] = useState(false);
  const [pdfSeleccionado, setPdfSeleccionado] = useState(null);
  const { enqueueSnackbar } = useSnackbar();



  const fetchFacturas = useCallback(async () => {
    try {
      const res = await api.get("/facturas/");
      const formateados = res.data
        .filter((n) => n.estado === estado)
        .map(formatearFacturas);
      setfacturas(formateados);
    } catch (error) {
      console.error("Error al obtener las Facturas:", error);
      enqueueSnackbar("Error al cargar las Facturas", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, estado]);

  useEffect(() => {
    fetchFacturas();
  }, [fetchFacturas]);


  const onExport = () => {
    const columnsToExport = columns.filter((c) => !c.disableExport);
    exportExcel(columnsToExport, facturas, exportNombre);
  };

  const handleView = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleDownload = async (pdfId, pdfTitle) => {
    try {
      const res = await api.get(`facturas/${pdfId}/download_factura/`, {
        responseType: "blob",
      });

      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = pdfTitle.endsWith(".pdf") ? pdfTitle : `${pdfTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Error al descargar Factura", { variant: "error" });
    }
  };

  // const handleOpenConfirm = (row) => {
  //   setPdfSeleccionado(row);
  //   setConfirmOpen(true);
  // };

  const handleOpenConfirmPagar = (row) => {
    setPdfSeleccionado(row);
    setConfirmOpenPagar(true);
  };

  const handleConfirm = async () => {
    try {
      await api.delete(`/facturas/${pdfSeleccionado.id_pdf}/`);
      enqueueSnackbar("factura eliminada correctamente", { variant: "success" });
      setConfirmOpen(false);
      fetchFacturas(); // refresca la grilla
    } catch (error) {
      console.error("Error al eliminar la Factura:", error);
      enqueueSnackbar("Error al eliminar la Factura", { variant: "error" });
    }
  };

  const handlePagar = async () => {
    try {
      await api.patch(`/facturas/${pdfSeleccionado.id_pdf}/`, { estado: "NO PAGADO" });
      enqueueSnackbar("Factura marcada como PAGADO", { variant: "success" });
      setConfirmOpenPagar(false);
      fetchFacturas(); // refresca la grilla
    } catch (error) {
      console.error("Error al marcar la Factura como PAGADO:", error);
      enqueueSnackbar("Error al marcar la Factura como PAGADO", { variant: "error" });
    }
  }



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={30}>
        <CircularProgress />
      </Box>
    );
  }

  const columns = [
    {
      field: "title",
      headerName: "Título",
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', mt: 1.7 }}>
          <PictureAsPdf color="primary" />
          <Typography variant="body2" noWrap sx={{ flex: 1 }}>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: "empresa",
      headerName: "Empresa",
      width: 260,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: "usuario_creador",
      headerName: "Subido por",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: "created_at",
      headerName: "Fecha Subida",
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
          <Typography variant="body2">
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: "observacion",
      headerName: "Observación",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: 'ver',
      headerName: 'Ver Factura',
      headerAlign: 'center',
      width: 120,
      disableExport: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleView(params.row.file_url)}
            title="Ver Factura"
          >
            <Visibility />
          </IconButton>
        </Box>
      )
    },
    {
      field: 'descargar',
      headerName: 'Descargar',
      headerAlign: 'center',
      width: 120,
      disableExport: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => handleDownload(params.row.id_pdf, params.row.title)}
            title="Descargar Factura"
          >
            <Download />
          </IconButton>
        </Box>
      )
    },
    {
      field: "estado",
      headerName: "Pagar",
      align: "center",
      headerAlign: "center",
      disableExport: true,
      width: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <IconButton
            color="warning"
            onClick={() => handleOpenConfirmPagar(params.row)}
          >
            <DisabledByDefaultIcon />
          </IconButton>
        </Box>
      ),
    },
    // {
    //   field: 'eliminar',
    //   headerName: 'Eliminar',
    //   headerAlign: 'center',
    //   width: 100,
    //   disableExport: true,
    //   renderCell: (params) => (
    //     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
    //       <IconButton
    //         color="error"
    //         size="small"
    //         onClick={() => handleOpenConfirm(params.row)}
    //         title="Eliminar Factura"
    //       >
    //         <Delete />
    //       </IconButton>
    //     </Box>
    //   )
    // }
  ];



  return (
    <Box sx={{ height: "80vh", width: '83.5vw', marginLeft: 1 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        {nombre}
      </Typography>

      <DataGrid
        rows={facturas}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id_pdf}
        pageSize={10}
        slots={{ toolbar: CustomToolBar }}
        slotProps={{ toolbar: { onExport } }}
        showToolbar
        rowsPerPageOptions={[10, 20, 50]}
        disableSelectionOnClick
        initialState={{
          sorting: { sortModel: [{ field: "created_at", sort: "desc" }] },
          columns: {
            columnVisibilityModel: {
              creator: false,
              producer: false,
              subject: false,
              updated_at: false,
            },
          },
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar PDF"
        content={`Se eliminará la Factura "${pdfSeleccionado?.title}". Esta acción no se puede deshacer.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
      <ConfirmDialog
        open={confirmOpenPagar}
        title="Factura Pagada"
        content={`La factura ${pdfSeleccionado?.title} ya esta pagada. Si confirma se cambiará a No Pagada.`}
        onClose={() => setConfirmOpenPagar(false)}
        onConfirm={handlePagar}
      />

    </Box>
  );
};

export default HistoricoFacturasGrid;