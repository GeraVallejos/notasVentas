import { useState } from "react";
import { api } from "../../utils/api";
import { useSnackbar } from "notistack";
import DropZone from "./DropZone";





const PickingLoad = () => {

    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleFilesDrop = async (files) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const res = await api.post('notas_productos/upload_excel/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            enqueueSnackbar(res.data.msg || "Archivo subido con éxito", { variant: "success" });

        } catch (err) {
            console.error("Error subiendo el archivo:", err);
            const msg = err.response?.data?.error || err.message || "Error subiendo el archivo";
            enqueueSnackbar(msg, { variant: "error" });

        } finally {
            setLoading(false);
        }
    };


    return (
        <>
        <DropZone
            onFilesDrop={handleFilesDrop}
            accept='.xls,.xlsx'
            loading={loading}
        />
        </>
    )
}

export default PickingLoad;