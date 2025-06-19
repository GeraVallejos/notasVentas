import { Paper, Button, Stack, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const FilterComponent = ({ 
  fechaInicio, 
  setFechaInicio, 
  fechaFin, 
  setFechaFin, 
  handleFilterSubmit, 
  loading 
}) => {
  return (
    <Paper 
      sx={{
        p: 1.5,
        mb: 3,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 0 0 1px primary.main',
        },
        transition: 'all 0.2s ease',
      }}
    >
      <form onSubmit={handleFilterSubmit}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <DatePicker
            label="Fecha inicio"
            value={fechaInicio}
            onChange={setFechaInicio}
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                size: 'small',
                sx: {
                  width: 200,
                  '& .MuiInputBase-root': {
                    height: 40,
                    fontSize: 'body2.fontSize',
                    '& input': {
                      py: 1,
                      px: 1.5,
                    },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                },
              },
            }}
          />

          <DatePicker
            label="Fecha fin"
            value={fechaFin}
            onChange={setFechaFin}
            format="dd/MM/yyyy"
            slotProps={{
              textField: {
                size: 'small',
                sx: {
                  width: 200,
                  '& .MuiInputBase-root': {
                    height: 40,
                    fontSize: 'body2.fontSize',
                    '& input': {
                      py: 1,
                      px: 1.5,
                    },
                  },
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              height: 40,
              minWidth: 120,
              px: 2,
              fontWeight: 'fontWeightMedium',
              letterSpacing: 0.5,
              whiteSpace: 'nowrap',
              borderRadius: '999px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
            }}
          >
            {loading ? 'Cargando...' : 'Aplicar'}
          </Button>

          {loading && (
            <CircularProgress 
              size={20} 
              color="primary"
              sx={{ color: 'primary.main' }}
            />
          )}
        </Stack>
      </form>
    </Paper>
  );
};

export default FilterComponent;