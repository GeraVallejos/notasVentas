import { useCallback, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Checkbox, CircularProgress, Button } from '@mui/material';
import { eachDayOfInterval, endOfMonth, startOfMonth, getDay, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import dataGridEs from '../../utils/dataGridEs';
import CustomToolBar from '../common/CustomToolbar';
import { exportExcel } from '../../utils/exportExcel';
import { api } from '../../utils/api';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';

function getSaturdaysOfMonth(date) {
    const days = eachDayOfInterval({
        start: startOfMonth(date),
        end: endOfMonth(date),
    });

    return days
        .filter(day => getDay(day) === 6)
        .map(day => format(day, 'yyyy-MM-dd'));
}

const SabadosMesGrid = ({ exportNombre }) => {
    const today = new Date();
    const saturdays = getSaturdaysOfMonth(today);
    const [personal, setPersonal] = useState([]);
    const [originalData, setOriginalData] = useState([]); // Para guardar los datos originales
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false); // Para controlar si hay cambios pendientes

    // Cargar datos del personal y sus sábados trabajados
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            // 1. Obtener el personal
            const resPersonal = await api.get('/personal/');

            // 2. Obtener sábados trabajados para cada persona
            const personalConSabados = await Promise.all(
                resPersonal.data.map(async (p) => {
                    try {
                        const res = await api.get(`/personal/${p.id_personal}/sabados-trabajados/`);
                        const sabadosPersona = res.data.sabados || [];

                        const sabadosEstado = Object.fromEntries(
                            saturdays.map(date => [date, sabadosPersona.includes(date)])
                        );

                        return {
                            ...p,
                            nombre_completo: `${p.nombre} ${p.apellido}`,
                            ...sabadosEstado
                        };
                    } catch (error) {
                        console.error(`Error al cargar sábados para personal ${p.id_personal}:`, error);
                        const sabadosEstado = Object.fromEntries(
                            saturdays.map(date => [date, false])
                        );
                        return {
                            ...p,
                            nombre_completo: `${p.nombre} ${p.apellido}`,
                            ...sabadosEstado
                        };
                    }
                })
            );

            setPersonal(personalConSabados);
            setOriginalData(personalConSabados); // Guardar copia de los datos originales
            setHasChanges(false); // Resetear cambios al cargar nuevos datos
        } catch (error) {
            console.error('Error al cargar datos:', error);
            enqueueSnackbar('Error al cargar datos', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar, saturdays]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCheckboxChange = (id, date, checked) => {
        setPersonal(prev => prev.map(p =>
            p.id_personal === id ? { ...p, [date]: checked } : p
        ));
        setHasChanges(true); // Marcar que hay cambios pendientes
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);

            // Preparar datos para enviar al servidor
            await Promise.all(
                personal.map(async (person) => {
                    // Obtener todos los sábados marcados (tanto existentes como nuevos)
                    const sabadosMarcados = saturdays.filter(date => person[date]);

                    // Enviar la lista completa de sábados marcados para esta persona
                    await api.post(`/personal/${person.id_personal}/asignar-sabados/`, {
                        sabados: sabadosMarcados
                    });
                })
            );

            // Actualizar datos
            await fetchData();
            enqueueSnackbar('Cambios guardados exitosamente', { variant: 'success' });
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            const errorMessage = error.response?.data?.error ||
                'Error al guardar cambios en el servidor';
            enqueueSnackbar(errorMessage, { variant: 'error' });
            setPersonal([...originalData]); // Revertir cambios locales
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            field: 'nombre_completo',
            headerName: 'Nombre',
            width: 300,
        },
        ...saturdays.map(date => ({
            field: date,
            headerName: format(parseISO(date), 'dd MMM', { locale: es }),
            flex: 1,  // Esto hace que la columna se expanda para ocupar el espacio disponible
            minWidth: 100,  // Ancho mínimo para evitar que se hagan demasiado estrechas
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" width="100%">
                    <Checkbox
                        checked={!!params.row[date]}
                        onChange={(e) => handleCheckboxChange(params.id, date, e.target.checked)}
                    />
                </Box>
            )
        })),
    ];

    const onExport = () => {
        const exportRows = personal.map(p => ({
            ...p,
            ...Object.fromEntries(saturdays.map(date => [date, p[date] ? 'X' : '']))
        }));
        exportExcel(columns, exportRows, exportNombre);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={30}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ height: '75vh', width: '82.5vw', marginLeft: 2 }}>

            <DataGrid
                rows={personal}
                columns={columns}
                getRowId={(row) => row.id_personal}
                disableColumnMenu
                hideFooter
                disableSelectionOnClick
                slots={{ toolbar: CustomToolBar }}
                slotProps={{ toolbar: { onExport } }}
                showToolbar
                localeText={dataGridEs}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 2 }}>
                <Button
                variant="outlined"
                component={Link}
                to="/historico-sabados"
                startIcon={<HistoryIcon />}
            >
                Ver Histórico
            </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveChanges}
                    disabled={!hasChanges || loading}
                >
                    {loading ? 'Guardando...' : 'GUARDAR CAMBIOS'}
                </Button>
            </Box>
        </Box>
    );
};

export default SabadosMesGrid;