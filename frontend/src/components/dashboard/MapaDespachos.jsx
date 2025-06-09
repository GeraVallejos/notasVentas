import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Typography, Paper } from '@mui/material';

const MapaDespachos = ({ dataDespachos, geoData }) => {
    // 1. Crear un mapa de nombres normalizados a originales
    const nombresComunas = {};
    geoData.features.forEach(feature => {
        const nombreNormalizado = feature.properties.Comuna_Normalizada;
        const nombreOriginal = feature.properties.Comuna;
        nombresComunas[nombreNormalizado] = nombreOriginal;
    });


    // 2. Enriquecer dataDespachos con nombres originales
    const dataEnriquecida = dataDespachos.map(item => ({
        ...item,
        nombreOriginal: nombresComunas[item.comuna] || item.comuna
    }));

    // 3. Ordenar comunas por cantidad de despachos (de mayor a menor) y tomar top 5
    const topComunas = [...dataEnriquecida]
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

    // 4. Mapa de despachos (usando nombres normalizados para el matching)
    const mapaDespachos = dataDespachos.reduce((acc, item) => {
        acc[item.comuna] = item.total;
        return acc;
    }, {});

    // Función para obtener colores
    const getColor = (cantidad) => {
        if (cantidad > 100) return '#800026';
        if (cantidad > 50) return '#BD0026';
        if (cantidad > 20) return '#E31A1C';
        if (cantidad > 10) return '#FC4E2A';
        if (cantidad > 5) return '#FD8D3C';
        if (cantidad > 0) return '#FEB24C';
        return '#FFEDA0';
    };

    // Estilo para las features (igual que el original)
    const style = (feature) => {
        const comunaNorm = feature.properties.Comuna_Normalizada;
        const cantidad = mapaDespachos[comunaNorm] || 0;
        return {
            fillColor: getColor(cantidad),
            weight: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    };

    // Función para cada feature (mostrando nombre original en tooltip)
    const onEachFeature = (feature, layer) => {
        const comunaOriginal = feature.properties.Comuna;
        const comunaNorm = feature.properties.Comuna_Normalizada;
        const cantidad = mapaDespachos[comunaNorm] || 0;
        layer.bindTooltip(`${comunaOriginal}: ${cantidad} despacho${cantidad !== 1 ? 's' : ''}`);
    };

    return (
        <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
            {/* Leyenda flotante con nombres originales */}
            <Paper sx={{
                position: 'absolute',
                right: 10,
                top: 10,
                zIndex: 1000,
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                maxHeight: '100%',
                overflowY: 'auto',
                width: 200,
                boxShadow: 3,
                borderRadius: 1
            }}>
                <Typography variant="subtitle1" sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    borderBottom: '1px solid #ddd',
                    pb: 1
                }}>
                    Top 5 Comunas
                </Typography>

                {topComunas.map((comuna, index) => (
                    <Box key={index} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        p: 0.5,
                        '&:hover': { backgroundColor: '#f5f5f5' }
                    }}>
                        <Box sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: getColor(comuna.total),
                            mr: 1.5,
                            borderRadius: '2px',
                            flexShrink: 0
                        }} />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                            <strong>{comuna.nombreOriginal}</strong>: {comuna.total}
                        </Typography>
                    </Box>
                ))}

                {/* Leyenda de colores */}
                <Typography variant="subtitle1" sx={{
                    fontWeight: 'bold',
                    mt: 2,
                    mb: 1,
                    borderTop: '1px solid #ddd',
                    pt: 1
                }}>
                    Rangos de despachos
                </Typography>

                {[
                    { label: '> 100', value: 101 },
                    { label: '51-100', value: 51 },
                    { label: '21-50', value: 21 },
                    { label: '11-20', value: 11 },
                    { label: '6-10', value: 6 },
                    { label: '1-5', value: 1 },
                    { label: '0', value: 0 }
                ].map((item, index) => (
                    <Box key={index} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 0.5
                    }}>
                        <Box sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: getColor(item.value),
                            mr: 1.5,
                            borderRadius: '2px',
                            flexShrink: 0
                        }} />
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Paper>

            {/* Mapa */}
            <MapContainer
                center={[-33.45, -70.66]}
                zoom={10}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <GeoJSON
                    key={JSON.stringify(dataDespachos)}
                    data={geoData}
                    style={style}
                    onEachFeature={onEachFeature}
                />
            </MapContainer>
        </Box>
    );
};

export default MapaDespachos;