import { useCallback, useEffect, useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Box,
    useTheme
} from '@mui/material';
import {
    BarChart,
    PieChart,
} from '@mui/x-charts';
import { api } from '../../utils/api';
import { format, addDays, subDays, parse } from 'date-fns';
import FilterComponent from '../dashboard/FilterComponent';
import MapaDespachos from '../dashboard/MapaDespachos';
import rmGeoJson from '../../assets/mapas/rm_normalizado.json';
import normalizarNombre from '../../utils/normalizarNombre';
import { useSnackbar } from 'notistack';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const [fechaInicio, setFechaInicio] = useState(subDays(new Date(), 1));
    const [fechaFin, setFechaFin] = useState(addDays(new Date(), 7));
    const [notasPorDiaSemana, setNotasPorDiaSemana] = useState([]);
    const [dataDespachos, setDataDespachos] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const colores = ['#1976d2', '#d32f2f'];

    const pieData = data?.notas?.por_estado?.map((item, index) => ({
        id: item.despacho_retira,
        value: item.total,
        label: item.despacho_retira,
        color: colores[index % 2],
    })) ?? [];

    const fetchData = useCallback(async (inicio = fechaInicio, fin = fechaFin) => {
        setLoading(true);
        try {
            const response = await api.get('/dashboard/resumen/', {
                params: {
                    fecha_inicio: format(inicio, 'yyyy-MM-dd'),
                    fecha_fin: format(fin, 'yyyy-MM-dd')
                }
            });

            setData(response.data);
            setDataDespachos(
                (response.data.comunas?.resumen || []).map(item => ({
                    comuna: normalizarNombre(item.comuna),
                    despacho_retira: item.despacho_retira,
                    total: item.total,
                })).filter(item => item.despacho_retira === 'Despacho')
            );

            const datosNotas = [];
            if (response.data?.notas?.por_dia) {
                response.data.notas.por_dia.forEach((item) => {
                    if (item?.day && typeof item.total === 'number') {
                        const parsed = parse(item.day, 'yyyy-MM-dd', new Date());
                        datosNotas.push({
                            fecha: format(parsed, 'dd/MM'),
                            fechaRaw: item.day,
                            total: item.total
                        });
                    }
                });
            }
            setNotasPorDiaSemana(datosNotas);
            setError(null);
        } catch (err) {
            let errorMessage = 'Error al cargar datos';
            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response) {
                errorMessage = `Error ${err.response.status}`;
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            console.error('Error detalles:', err);
        } finally {
            setLoading(false);
        }
    }, [fechaInicio, fechaFin]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterSubmit = useCallback((e, nuevaFechaInicio, nuevaFechaFin) => {
        e.preventDefault();
        if (nuevaFechaFin < nuevaFechaInicio) {
            enqueueSnackbar('La fecha de fin no puede ser anterior a la fecha de inicio.', {
                variant: 'warning',
            });
            return;
        }
        setFechaInicio(nuevaFechaInicio);
        setFechaFin(nuevaFechaFin);
        fetchData(nuevaFechaInicio, nuevaFechaFin);
    }, [fetchData, enqueueSnackbar]);

    if (loading && !data) return (
        <Box display="flex" justifyContent="center" mt={20}>
            <CircularProgress />
        </Box>
    );

    if (error) return (
        <Box display="flex" justifyContent="center" mt={4}>
            <Typography color="error">{error}</Typography>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container justifyContent='space-between' alignItems='top' sx={{ mb: 3 }}>
                <Grid>
                    <Typography variant="h5">Resumen General</Typography>
                </Grid>

                <Grid>
                    <FilterComponent
                        fechaInicio={fechaInicio}
                        setFechaInicio={setFechaInicio}
                        fechaFin={fechaFin}
                        setFechaFin={setFechaFin}
                        handleFilterSubmit={handleFilterSubmit}
                        loading={loading}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} display='flex' justifyContent='center'>
                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" align='center'>Total de Notas</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                                {data?.notas?.total ?? 0}
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                                {format(fechaInicio, 'dd/MM/yyyy')} - {format(fechaFin, 'dd/MM/yyyy')}
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            {loading ? (
                                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                    <CircularProgress />
                                </Box>
                            ) : pieData.length === 0 ? (
                                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                    <Typography variant="body2" color="text.secondary">
                                        No hay datos de notas para este período.
                                    </Typography>
                                </Box>
                            ) : (
                                <PieChart
                                    series={[{
                                        data: pieData,
                                        outerRadius: 70,
                                        innerRadius: 30,
                                        paddingAngle: 1,
                                        cornerRadius: 4,
                                        highlightScope: { faded: 'global', highlighted: 'item' },
                                        faded: { additionalRadius: -4, color: 'gray' },
                                    }]}
                                    height={220}
                                    legend={{
                                        direction: 'row',
                                        position: { vertical: 'bottom', horizontal: 'middle' },
                                        itemMarkWidth: 10,
                                        itemGap: 10,
                                        labelStyle: { fontSize: 12 }
                                    }}
                                />
                            )}
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Días de Despacho por Notas de Ventas
                        </Typography>

                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <CircularProgress />
                            </Box>
                        ) : notasPorDiaSemana.length === 0 ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <Typography variant="body2" color="text.secondary">
                                    No hay datos de notas en este período.
                                </Typography>
                            </Box>
                        ) : (
                            <BarChart
                                xAxis={[{
                                    data: notasPorDiaSemana.map(d => d.fecha),
                                    label: 'Fecha',
                                    scaleType: 'band',
                                }]}
                                yAxis={[{
                                    label: 'Cantidad de notas',
                                    valueFormatter: (value) => Math.floor(value).toString(),
                                    tickMinStep: 1,
                                }]}
                                series={[{
                                    data: notasPorDiaSemana.map(d => d.total),
                                    label: 'Pedidos por día',
                                    color: theme.palette.primary.main,
                                    highlightScope: {
                                        highlighted: 'item',
                                        faded: 'global',
                                    },
                                    itemStyle: (params) => {
                                        const hoy = format(new Date(), 'dd/MM');
                                        const isToday = notasPorDiaSemana[params.dataIndex].fecha === hoy;
                                        return {
                                            fill: isToday ? theme.palette.secondary.main : theme.palette.primary.main,
                                            stroke: isToday ? theme.palette.secondary.dark : undefined,
                                            strokeWidth: isToday ? 2 : 0,
                                        };
                                    },
                                }]}
                                height={300}
                                sx={{
                                    '& .MuiChartsAxis-tickLabel': {
                                        fontSize: 14,
                                    },
                                    '& .MuiChartsBar-root': {
                                        borderRadius: 4,
                                    },
                                }}
                            />
                        )}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
                            Otra métrica importante
                        </Typography>
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <Typography color="text.secondary">
                                Espacio disponible para otra visualización
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Mapa de Despachos por Comuna (RM)
                        </Typography>
                        <Box sx={{ height: 500 }}>
                            <MapaDespachos
                                dataDespachos={dataDespachos}
                                geoData={rmGeoJson}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
