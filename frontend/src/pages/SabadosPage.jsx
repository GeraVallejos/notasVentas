import { format } from "date-fns";
import  SabadosMesGrid  from '../components/dataGrids/SabadosMesGrid';



const SabadosPage = () => {

   const fechaActual = new Date();
  
    // Formato con fecha y hora completa
    const fecha = format(fechaActual, 'dd/MM/yyyy HH:mm:ss');


  return (
    <SabadosMesGrid exportNombre={`Sabados_${fecha}`}/>
  )
}

export default SabadosPage 