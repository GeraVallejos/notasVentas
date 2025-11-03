import PickingGrid from "../components/dataGrids/PickingGrid"


const PickingGridPage = () => {
  return (
    <PickingGrid 
      estado= {['PENDIENTE','TERMINADO', 'PREPARANDO', 'ENVIADO', 'GUIA']}
      nombre="Pedidos Pendientes"
      exportNombre="Picking_Pendientes"
      userGroup={localStorage.getItem("userGroup") || ""}
    />
  )
}

export default PickingGridPage