import { format } from "date-fns";

import { useSelector } from 'react-redux';
import NotasDataGrid from "../components/dataGrids/NotasDataGrid";

const HistoricoNotasPage = () => {

  const fechaActual = new Date();
  
    // Formato con fecha y hora completa
    const fecha = format(fechaActual, 'dd/MM/yyyy HH:mm:ss');

    const userGroups = useSelector(state => state.auth.user?.groups || []);

  return (
    <NotasDataGrid
      estado="Solicitado"
      nombre="Historial Notas de Ventas"
      exportNombre={`Notas_de_Ventas_${fecha}`}
      userGroups={userGroups}
    />
  )
}

export default HistoricoNotasPage