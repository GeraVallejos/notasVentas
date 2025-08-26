import { format } from "date-fns";
import HistoricoFacturasGrid from "../components/dataGrids/HistoricoFacturasGrid";



const HistoricoFacturasPage = () => {

  const fechaActual = new Date();
  
    // Formato con fecha y hora completa
    const fecha = format(fechaActual, 'dd/MM/yyyy HH:mm:ss');



  return (
    <HistoricoFacturasGrid
      estado="PAGADO"
      nombre="Historial Facturas Pagadas"
      exportNombre={`Historico_Facturas_${fecha}`}

    />
  )
}

export default HistoricoFacturasPage;