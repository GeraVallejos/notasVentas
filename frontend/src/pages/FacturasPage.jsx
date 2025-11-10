import { format } from "date-fns";
import FacturasDataGrid from "../components/dataGrids/FacturasDataGrid";


const FacturasPage = () => {

  const fechaActual = new Date();
  
    // Formato con fecha y hora completa
    const fecha = format(fechaActual, 'dd/MM/yyyy HH:mm:ss');

  return (
    <FacturasDataGrid
      nombre="Facturas de Compras"
      exportNombre={`Facturas_${fecha}`}
      estado={'NO PAGADO'}
    />
  )
}

export default FacturasPage;