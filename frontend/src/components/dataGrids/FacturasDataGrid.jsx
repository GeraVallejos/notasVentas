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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  PictureAsPdf,
  Download,
  Visibility,
  Delete
} from "@mui/icons-material";
import usePDFMetadata from "../../hooks/usePDFMetadata";
import DropZone from "../common/DropZone";
import PDFMetadataModal from "../modals/PDFMetadataModal";


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
  signed_url: pdf.signed_url || pdf.file_url,
  download_url: pdf.download_url || pdf.signed_url || pdf.file_url,
});

const FacturasDataGrid = ({ nombre, exportNombre, estado }) => {
  const [facturas, setfacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOpenPagar, setConfirmOpenPagar] = useState(false);
  const [metadataModalOpen, setMetadataModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentMetadata, setCurrentMetadata] = useState(null);
  const [pdfSeleccionado, setPdfSeleccionado] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { extractPDFMetadata, extracting } = usePDFMetadata();


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

  const handleFilesDrop = async (files) => {
    setUploading(true);

    try {
      for (const file of files) {
        const metadata = await extractPDFMetadata(file);
        setCurrentFile(file);
        setCurrentMetadata(metadata);
        setMetadataModalOpen(true);
        break; // Procesar solo el primer archivo por ahora
      }
    } catch (error) {
      console.error("Error procesando archivos:", error);
      enqueueSnackbar("Error al procesar los archivos", { variant: "error" });
    } finally {
      setUploading(false);
    }
  };

  const normalizeFileName = (file) => {
    const name = file.name
      .trim()
      .replace(/\s+/g, "_")      // reemplaza espacios por _
      .replace(/[^a-zA-Z0-9_.-]/g, ""); // elimina caracteres especiales
    return new File([file], name, { type: file.type });
  };


  const handleSaveMetadata = async (metadata) => {
    if (!currentFile) return;

    const normalizedFile = normalizeFileName(currentFile);

    const formData = new FormData();
    formData.append('file', normalizedFile);
    formData.append('title', metadata.title);
    formData.append('file_size', currentFile.size);
    if (metadata.observacion) formData.append('observacion', metadata.observacion);
    if (metadata.empresa) formData.append('empresa', metadata.empresa);


    try {
      await api.post('/facturas/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      enqueueSnackbar('Factura subida correctamente', { variant: 'success' });
      fetchFacturas();
    } catch (error) {
      console.error('Error subiendo la Factura:', error);
      enqueueSnackbar('Error al subir la Factura', { variant: 'error' });
    } finally {
      setMetadataModalOpen(false);
      setCurrentFile(null);
      setCurrentMetadata(null);
      setUploading(false);
    }
  };

  const onExport = () => {
    const columnsToExport = columns.filter((c) => !c.disableExport);
    exportExcel(columnsToExport, facturas, exportNombre);
  };

  const handleView = (pdf) => {

    window.open(pdf.signed_url, "_blank");
  };

  const handleDownload = async (pdf) => {
  if (!pdf.download_url) return;

  try {
    const response = await fetch(pdf.download_url);
    if (!response.ok) throw new Error("Error al descargar el archivo");

    // 👇 Fuerza a que sea tratado como archivo genérico, no PDF
    const blob = await response.blob();
    const file = new Blob([blob], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = url;
    link.download = pdf.title ? `${pdf.title}.pdf` : "archivo.pdf"; // nombre amigable
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al descargar la factura:", error);
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
      await api.delete(`/facturas/${pdfSeleccionado.id_factura}/`);
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
      await api.patch(`/facturas/${pdfSeleccionado.id_factura}/`, { estado: "PAGADO" });
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
            onClick={() => handleView(params.row)}
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
            onClick={() => handleDownload(params.row)}
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
            color="success"
            onClick={() => handleOpenConfirmPagar(params.row)}
          >
            <CheckCircleIcon />
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
    <Box sx={{ height: "50vh", width: '83vw', marginLeft: 1 }}>
      <Typography variant="h5" gutterBottom >
        {nombre}
      </Typography>

      <DropZone
        onFilesDrop={handleFilesDrop}
        loading={uploading || extracting}
      />

      <DataGrid
        rows={facturas}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id_factura}
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
        content={`Se eliminará la Factura ${pdfSeleccionado?.title}. Esta acción no se puede deshacer.`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
      <ConfirmDialog
        open={confirmOpenPagar}
        title="Factura Pagada"
        content={`La factura ${pdfSeleccionado?.title} se cambiará a pagada.`}
        onClose={() => setConfirmOpenPagar(false)}
        onConfirm={handlePagar}
      />

      <PDFMetadataModal
        open={metadataModalOpen}
        onClose={() => setMetadataModalOpen(false)}
        metadata={currentMetadata}
        onSave={handleSaveMetadata}
      />
    </Box>
  );
};

export default FacturasDataGrid;