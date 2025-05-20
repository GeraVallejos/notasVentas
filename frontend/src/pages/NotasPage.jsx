import { NotaForm } from "../components/forms/NotaForm"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const NotasPage = () => {
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NotaForm />
    </LocalizationProvider>
    </>
  
  )
}

export default NotasPage