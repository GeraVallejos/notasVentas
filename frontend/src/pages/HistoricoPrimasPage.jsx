import { format } from 'date-fns';
import MateriasPrimasGrid from '../components/dataGrids/MateriasPrimasGrid';


const HistoricoPrimasPage = () => {
   const fechaActual = new Date();

  // Formato con fecha y hora completa
  const fecha = format(fechaActual, 'dd/MM/yyyy HH:mm:ss');



  return (
    <MateriasPrimasGrid
      estado="SOLICITADO"
      nombre="Historico Materias Primas"
      exportNombre={`Historico_Materias_Primas${fecha}`}
    />
  )
}

export default HistoricoPrimasPage;