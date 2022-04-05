import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Container from '@mui/material/Container';

export default function Layout({children}) {

    const theme = createTheme({
        palette: {
            type: 'dark',
            primary: {
                main: '#3f51b5',
            },
            secondary: {
                main: '#f50057',
            },
            background: {
                default: '#1f222c',
                paper: '#2a2e3d',
            },
            text: {
                primary: '#ffffff',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth="xs" sx={{
                marginTop: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                {children}
            </Container>
        </ThemeProvider>
    )
}
