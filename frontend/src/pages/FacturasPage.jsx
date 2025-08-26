import { format } from "date-fns";
import PDFDataGrid from "../components/dataGrids/PDFDataGrid"


const FacturasPage = () => {

  const fechaActual = new Date();
  
    // Formato con fecha y hora completa
    const fecha = format(fechaActual, 'dd/MM/yyyy HH:mm:ss');

  return (
    <PDFDataGrid
      nombre="Facturas de Compras"
      exportNombre={`Facturas_${fecha}`}
      estado={'NO PAGADO'}
    />
  )
}

export default FacturasPage;