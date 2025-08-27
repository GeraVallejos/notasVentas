import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Alert,
    Box,
    Typography
} from "@mui/material";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import SearchSelect from "../common/SearchSelect";

const PDFMetadataModal = ({
    open,
    onClose,
    metadata,
    onSave,
    title = "Metadatos del PDF",
    saveButtonText = "Guardar y Subir",
    cancelButtonText = "Cancelar"
}) => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,

        formState: { isSubmitting }
    } = useForm({
        defaultValues: {
            title: '',
            empresa: '',
            observacion: ''
        }
    }); 

    useEffect(() => {
        if (metadata) {
            reset({
                title: metadata.title || metadata.fileName?.replace('.pdf', '') || '',
                empresa: metadata.empresa || '',
                observacion: metadata.observacion || ''
            });
        }
    }, [metadata, reset]);

    const onSubmit = (data) => {
        if (onSave) {
            onSave(data);
        }
    };

    const handleClose = () => {
        reset();
        if (onClose) {
            onClose();
        }
    };

    const handleEmpresaSelect = (selectedValue) => {
        if (selectedValue && selectedValue.razon_social) {
            setValue('empresa', selectedValue.razon_social);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    {metadata?.fileName && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Box>
                                <Typography variant="subtitle2">Archivo: {metadata.fileName}</Typography>
                                {metadata.fileSize && (
                                    <Typography variant="body2">Tamaño: {metadata.fileSize}</Typography>
                                )}
                                {metadata.pageCount && (
                                    <Typography variant="body2">Páginas: {metadata.pageCount}</Typography>
                                )}
                            </Box>
                        </Alert>
                    )}

                    <form id="pdf-metadata-form" onSubmit={handleSubmit(onSubmit)}>
                        {/* Campo Título */}
                        <Controller
                            name="title"
                            control={control}
                            rules={{ required: 'El título es requerido' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Título *"
                                    margin="normal"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    required
                                />
                            )}
                        />

                        {/* Campo Empresa con SearchSelect */}
                        <SearchSelect
                            name="empresa"
                            control={control}
                            label="Empresa / Proveedor"
                            endpoint="/pedido_materias_primas/buscar-proveedores"
                            getOptionLabel={(option) => {
                                if (typeof option === 'string') return option;
                                return option.razon_social || option.nombre || '';
                            }}
                            onSelect={handleEmpresaSelect}
                        />

                        {/* Campo Observación */}
                        <Controller
                            name="observacion"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Observación"
                                    margin="normal"
                                    multiline
                                    rows={3}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    placeholder="Notas adicionales sobre el documento"
                                />
                            )}
                        />

                    </form>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isSubmitting}>
                    {cancelButtonText}
                </Button>
                <Button
                    
                    type="submit"
                    form="pdf-metadata-form"
                    variant="contained"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Subiendo...' : saveButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PDFMetadataModal;