import { format } from "date-fns";
import NotasDataGrid from "../components/common/NotasDataGrid";
import { useSelector } from 'react-redux';

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