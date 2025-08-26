import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const DropZone = ({ onFilesDrop, onFileSelect, loading = false, accept = ".pdf", multiple = true }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (files.length > 0 && onFilesDrop) {
      onFilesDrop(files);
    }
  };

  const handleClick = () => {
    if (onFileSelect) {
      onFileSelect();
    } else {
      // Crear input file programáticamente
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.multiple = multiple;
      
      input.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0 && onFilesDrop) {
          onFilesDrop(files);
        }
      };
      
      input.click();
    }
  };

  return (
    <Paper
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      sx={{
        p: 3,
        textAlign: 'center',
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'grey.300',
        backgroundColor: isDragging ? 'action.hover' : 'background.default',
        cursor: loading ? 'wait' : 'pointer',
        transition: 'all 0.3s ease',
        mb: 2,
        position: 'relative',
        '&:hover': {
          borderColor: loading ? 'grey.300' : 'primary.main',
          backgroundColor: loading ? 'background.default' : 'action.hover'
        }
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}
        >
          <CircularProgress />
        </Box>
      )}
      
      <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
      <Typography variant="h6" gutterBottom>
        {loading ? 'Procesando archivos...' : 'Arrastra las Facturas aquí o haz clic para seleccionar'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Soporta uno o múltiples archivos PDF
      </Typography>
    </Paper>
  );
};

export default DropZone;