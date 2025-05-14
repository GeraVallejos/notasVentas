import { CssBaseline, ThemeProvider } from '@mui/material'
import themeJJ from './themeJJ'


const AppTheme = ({ children }) => {
    return (
        <ThemeProvider theme={themeJJ}>
            <CssBaseline>
                {children}
            </CssBaseline>
        </ThemeProvider>
    )
}

export default AppTheme