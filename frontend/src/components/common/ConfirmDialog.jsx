import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ConfirmDialog = ({ open, title, content, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>
      <Box display="flex" alignItems="center" gap={1}>
        <WarningAmberIcon color="warning" />
        <Typography variant="h6" component="span">
          {title}
        </Typography>
      </Box>
    </DialogTitle>

    <DialogContent>
      <DialogContentText>{content}</DialogContentText>
    </DialogContent>

    <DialogActions>
      <Button onClick={onClose} variant="outlined">
        Cancelar
      </Button>
      <Button onClick={onConfirm} variant="contained" color="error" autoFocus>
        Confirmar
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;