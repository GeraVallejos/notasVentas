import { Outlet } from "react-router"
import AppTheme from "./theme/AppTheme"
import LoginLayout from "./layouts/LoginLayout"
import { SnackbarProvider } from "notistack"


function App() {

  return (
    <SnackbarProvider maxSnack={3}>
      <AppTheme>
        <LoginLayout>
          <Outlet />
        </LoginLayout>
      </AppTheme>
    </SnackbarProvider>
  )
}

export default App
