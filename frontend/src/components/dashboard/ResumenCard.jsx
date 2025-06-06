import { Paper, Typography, Skeleton, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  transition: 'all 0.25s ease-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[6],
  },
  borderRadius: theme.shape.borderRadius * 1.2,
}));

const ValueContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
  margin: `${theme.spacing(1)} 0`,
}));

const ColoredTypography = styled(Typography)(({ theme, color }) => ({
  color: color ? theme.palette[color]?.main || color : theme.palette.text.primary,
  lineHeight: 1,
  fontWeight: 700,
}));

const ResumenCard = ({ 
  titulo, 
  valor, 
  loading = false, 
  fechaInicio, 
  fechaFin,
  icon: Icon,
  color = 'primary',
  suffix = '',
  prefix = '',
  variant = 'h3'
}) => {
  return (
    <StyledCard elevation={2}>
      {/* Encabezado con icono */}
      <Box display="flex" alignItems="center" gap={1}>
        {Icon && (
          <Icon 
            fontSize="medium" 
            sx={{ 
              color: `${color}.main`,
              opacity: 0.9
            }} 
          />
        )}
        <Typography 
          variant="subtitle1"
          color="text.secondary"
          fontWeight={500}
          sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
        >
          {titulo}
        </Typography>
      </Box>
      
      {/* Valor principal */}
      <ValueContainer>
        {loading ? (
          <Skeleton 
            variant="rectangular" 
            width={120} 
            height={32} 
            sx={{ borderRadius: (theme) => theme.shape.borderRadius }}
          />
        ) : (
          <>
            {prefix && (
              <Typography 
                variant={variant === 'h3' ? 'h5' : 'h6'} 
                color="text.secondary"
                fontWeight={500}
              >
                {prefix}
              </Typography>
            )}
            <ColoredTypography 
              variant={variant}
              color={color}
            >
              {valor}
            </ColoredTypography>
            {suffix && (
              <Typography 
                variant={variant === 'h3' ? 'h5' : 'h6'} 
                color="text.secondary"
                fontWeight={500}
                sx={{ mb: variant === 'h3' ? 0.5 : 0.3 }}
              >
                {suffix}
              </Typography>
            )}
          </>
        )}
      </ValueContainer>
      
      {/* Fechas (si existen) */}
      {(fechaInicio && fechaFin) && (
        <Typography 
          variant="caption"
          color="text.secondary"
          sx={{ 
            mt: 'auto',
            pt: 2,
            display: 'block',
            opacity: 0.8
          }}
        >
          Período: {fechaInicio.format('DD/MM/YYYY')} - {fechaFin.format('DD/MM/YYYY')}
        </Typography>
      )}
    </StyledCard>
  );
};

export default ResumenCard;