import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Collapse,
  CircularProgress
} from '@mui/material';
import { format, eachMonthOfInterval, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '../../utils/api';
import { useSnackbar } from 'notistack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const HistoricoSabados = () => {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [expandedMonths, setExpandedMonths] = useState({});

  // Obtener los últimos 6 meses
  const meses = eachMonthOfInterval({
    start: subMonths(new Date(), 6),
    end: new Date()
  }).reverse();

  const toggleMonth = (mes) => {
    setExpandedMonths(prev => ({
      ...prev,
      [mes]: !prev[mes]
    }));
  };

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        setLoading(true);
        const response = await api.get('/personal/historico-sabados/');
        // Asegurarnos que sabados es siempre un array
        const data = response.data.map(item => ({
          ...item,
          sabados: Array.isArray(item.sabados) ? item.sabados : []
        }));
        setHistorico(data);
      } catch (error) {
        console.error('Error al cargar histórico:', error);
        enqueueSnackbar('Error al cargar histórico', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={30}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Histórico de Sábados Trabajados
      </Typography>
      
      {meses.map(mes => {
        const mesKey = format(mes, 'yyyy-MM');
        const mesLabel = format(mes, 'MMMM yyyy', { locale: es });
        const mesData = historico.filter(item => 
          item.mes === format(mes, 'yyyy-MM')
        );

        return (
          <Box key={mesKey} sx={{ mb: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: '#f5f5f5',
                p: 1,
                borderRadius: 1,
                cursor: 'pointer'
              }}
              onClick={() => toggleMonth(mesKey)}
            >
              <IconButton size="small">
                {expandedMonths[mesKey] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {mesLabel.charAt(0).toUpperCase() + mesLabel.slice(1)}
              </Typography>
              <Typography variant="body2" sx={{ ml: 'auto' }}>
                {mesData.length} personas
              </Typography>
            </Box>

            <Collapse in={expandedMonths[mesKey]} timeout="auto" unmountOnExit>
              <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell align="center">Sábados trabajados</TableCell>
                      <TableCell align="center">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mesData.map((item) => (
                      <TableRow key={`${mesKey}-${item.id_personal}`}>
                        <TableCell>{item.nombre} {item.apellido}</TableCell>
                        <TableCell align="center">
                          {item.sabados.join(', ')}
                        </TableCell>
                        <TableCell align="center">
                          {item.sabados.length}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Collapse>
          </Box>
        );
      })}
    </Box>
  );
};

export default HistoricoSabados;