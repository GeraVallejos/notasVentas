import PickingGrid from "../components/dataGrids/PickingGrid"


const PickingHistPage = () => {
    return (
        <PickingGrid
            estado={['RECIBIDO']}
            nombre="Pedidos Históricos"
            exportNombre="Picking_Pendientes"
            userGroup={localStorage.getItem("userGroup") || ""}
        />
    )
}

export default PickingHistPage