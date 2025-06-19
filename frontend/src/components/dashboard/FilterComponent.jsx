import { memo, useEffect, useState } from 'react';
import { Paper, Button, Stack, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const textFieldStyles = {
  width: 200,
  '& .MuiInputBase-root': {
    height: 40,
    fontSize: 'body2.fontSize',
    '& input': { py: 1, px: 1.5 },
  },
};

const buttonStyles = {
  height: 40,
  minWidth: 120,
  px: 2,
  fontWeight: 'fontWeightMedium',
  letterSpacing: 0.5,
  whiteSpace: 'nowrap',
  borderRadius: '999px',
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': { boxShadow: 'none' },
};

const paperStyles = {
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
};

const FilterComponent = memo(({
  fechaInicio: initialFechaInicio,

  fechaFin: initialFechaFin,

  handleFilterSubmit,
  loading
}) => {
  const [tempFechaInicio, setTempFechaInicio] = useState(initialFechaInicio);
  const [tempFechaFin, setTempFechaFin] = useState(initialFechaFin);

  useEffect(() => {
    setTempFechaInicio(initialFechaInicio);
    setTempFechaFin(initialFechaFin);
  }, [initialFechaInicio, initialFechaFin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pasamos las fechas temporales a handleFilterSubmit
    handleFilterSubmit(e, tempFechaInicio, tempFechaFin);
  };

  const commonDatePickerProps = {
    format: "dd/MM/yyyy",
    slotProps: {
      textField: {
        size: "small",
        sx: textFieldStyles,
      },
    },
  };

  return (
    <Paper sx={paperStyles}>
      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <DatePicker
            label="Fecha inicio"
            value={tempFechaInicio}
            onChange={setTempFechaInicio}
            {...commonDatePickerProps}
          />
          <DatePicker
            label="Fecha fin"
            value={tempFechaFin}
            onChange={setTempFechaFin}
            {...commonDatePickerProps}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={buttonStyles}
          >
            {loading ? 'Cargando...' : 'Aplicar'}
          </Button>
          {loading && (
            <CircularProgress size={20} color="primary" sx={{ color: 'primary.main' }} />
          )}
        </Stack>
      </form>
    </Paper>
  );
});

export default FilterComponent;
