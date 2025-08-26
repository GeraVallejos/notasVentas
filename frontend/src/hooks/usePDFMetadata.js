import { useState } from "react";

const usePDFMetadata = () => {
  const [extracting, setExtracting] = useState(false);

  const extractPDFMetadata = async (file) => {
    setExtracting(true);
    try {
      // Simulación de extracción de metadatos
      // En una implementación real, usarías pdf.js
      const metadata = {
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        title: file.name.replace('.pdf', ''),

      };
      
      return metadata;
    } catch (error) {
      console.error("Error extrayendo metadatos:", error);
      throw error;
    } finally {
      setExtracting(false);
    }
  };

  return { extractPDFMetadata, extracting };
};

export default usePDFMetadata;