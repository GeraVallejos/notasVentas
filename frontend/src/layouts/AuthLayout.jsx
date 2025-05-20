import { Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
      <Outlet />
    </Grid>
  );
};

export default AuthLayout;
