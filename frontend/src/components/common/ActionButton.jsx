import { useState } from 'react';
import { Button, CircularProgress, Tooltip, useMediaQuery } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/material/styles';

const ActionButton = ({
  action,
  label = '',
  onSuccess,
  icon = null,
  variant = 'outlined',
  color = 'primary',
  fullWidth = false,
  sx = {},
  tooltip = '', // texto opcional para el tooltip en móvil
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClick = async () => {
    setLoading(true);
    try {
      await action();
      if (onSuccess) onSuccess();
    } catch (error) {
      enqueueSnackbar(
        error?.message || error || 'Ha ocurrido un error',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  const button = (
    <Button
      onClick={handleClick}
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      disabled={loading}
      startIcon={!loading && icon}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 500,
        boxShadow: 'none',
        gap: 0.5,
        minHeight: '32px',
        padding: isMobile ? '6px' : '4px 10px',
        fontSize: isMobile ? '0' : '0.875rem',
        minWidth: isMobile ? 'auto' : '64px',
        ...sx,
      }}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : !isMobile && label}
    </Button>
  );

  return isMobile && label ? (
    <Tooltip title={tooltip || label}>
      <span>{button}</span>
    </Tooltip>
  ) : (
    button
  );
};

export default ActionButton;
