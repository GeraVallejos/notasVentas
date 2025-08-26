import { format } from 'date-fns';
import MateriasPrimasGrid from '../components/dataGrids/MateriasPrimasGrid';

const ListaMateriasPrimasPage = () => {
    const fechaActual = new Date();

  // Formato con fecha y hora completa
  const fecha = format(fechaActual, 'dd/MM/yyyy HH:mm:ss');



  return (
    <MateriasPrimasGrid
      estado="PENDIENTE"
      nombre="Insumos y Materias Primas"
      exportNombre={`Materias_Primas${fecha}`}
    />
  )
}

export default ListaMateriasPrimasPage