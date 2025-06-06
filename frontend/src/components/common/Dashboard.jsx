import { useEffect, useState } from 'react';
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
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ResumenCard from '../dashboard/ResumenCard';
import FilterComponent from '../dashboard/FilterComponent';
import MapaDespachos from '../dashboard/MapaDespachos';
import rmGeoJson from '../../assets/rm_normalizado.json'
import normalizarNombre from '../../utils/normalizarNombre';

dayjs.extend(customParseFormat);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const [fechaInicio, setFechaInicio] = useState(dayjs().subtract(1, 'day'));
    const [fechaFin, setFechaFin] = useState(dayjs().add(7, 'day'));
    const [notasPorDiaSemana, setNotasPorDiaSemana] = useState([]);
    const [dataDespachos, setDataDespachos] = useState([]);


    const colores = ['#1976d2', '#d32f2f']; // Azul y Rojo

    const pieData = data?.notas?.por_estado?.map((item, index) => ({
        id: item.despacho_retira,
        value: item.total,
        label: item.despacho_retira,
        color: colores[index % 2],
    })) ?? [];






    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/dashboard/resumen/', {
                params: {
                    fecha_inicio: fechaInicio.format('YYYY-MM-DD'),
                    fecha_fin: fechaFin.format('YYYY-MM-DD')
                }
            });
            setData(response.data);

            setDataDespachos(
                (response.data.comunas?.resumen || []).map(item => ({
                    comuna: normalizarNombre(item.comuna),
                    total: item.total
                }))

            );

            setError(null);
            const datosNotas = [];
            if (response.data?.notas?.por_dia) {
                response.data.notas.por_dia.forEach((item) => {

                    if (item?.day && typeof item.total === 'number') {
                        datosNotas.push({
                            fecha: dayjs(item.day, 'YYY-MM-DD').format('DD/MM'),
                            fechaRaw: item.day,
                            total: item.total
                        });
                    }
                });
            }
            setNotasPorDiaSemana(datosNotas);

        } catch (err) {
            let errorMessage = 'Error al cargar datos';
            if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.response) {
                errorMessage = `Error ${err.response.status}`;
            }
            setError(errorMessage);
            console.error('Error detalles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchData();
    };


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
        {/* Fila superior con título y filtros */}
        <Grid container justifyContent='space-between' alignItems='center' sx={{ mb: 3 }}>
            <Grid item>
                <Typography variant="h5">
                    Resumen General
                </Typography>
            </Grid>

            <Grid item>
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

        {/* Fila con las tarjetas combinadas */}
        <Grid container spacing={2} display='flex' justifyContent='center'>
            {/* Tarjeta combinada (Total + PieChart) */}
            <Grid item xs={12} sm={6} lg={4}>
                <Paper sx={{ p: 2, height: 400, width: 300, display: 'flex', flexDirection: 'column' }}>
                    {/* Sección superior: Total de Notas */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" align='center'>
                            Total de Notas
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                            {data?.notas?.total ?? 0}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                            {fechaInicio.format('DD/MM/YYYY')} - {fechaFin.format('DD/MM/YYYY')}
                        </Typography>
                    </Box>

                    {/* Sección inferior: Gráfico de pastel */}
                    <Box sx={{ flexGrow: 1 }}>
                        
                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                <CircularProgress />
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
                                slotProps={{
                                    legend: {
                                        direction: 'row',
                                        position: { vertical: 'bottom', horizontal: 'middle' },
                                        itemMarkWidth: 10,
                                        itemGap: 10,
                                        labelStyle: { fontSize: 12 }
                                    }
                                }}
                            />
                        )}
                    </Box>
                </Paper>
            </Grid>

            {/* Tarjeta 2 - Gráfico de barras (se mantiene igual) */}
            <Grid item xs={12} sm={6} lg={4}>
                <Paper sx={{ p: 2, height: 400 }}>
                    <Typography variant="h6" gutterBottom>
                        Dias de Despacho por Notas de Ventas
                    </Typography>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <CircularProgress />
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
                                    const hoy = dayjs().format('DD/MM');
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

            {/* Tarjeta adicional (puedes poner otra información aquí) */}
            <Grid item xs={12} sm={6} lg={4}>
                <Paper sx={{ p: 2, height: 400, width: 300 }}>
                    <Typography variant="h6" gutterBottom>
                        Otra métrica importante
                    </Typography>
                    {/* Aquí puedes agregar otro gráfico o información */}
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography color="text.secondary">
                            Espacio disponible para otra visualización
                        </Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>

        {/* Mapa de Despachos por Comuna */}
        <Grid container spacing={2} sx={{ mt: 2, display: 'flex', justifyContent: 'center'}}>
            <Grid item xs={12} sx={{width: '100%'}}>
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
