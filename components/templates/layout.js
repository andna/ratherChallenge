import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { Container, AppBar, Typography, Menu, MenuItem } from '@mui/material';
import React, { useState, useEffect } from "react";
import Image from 'next/image'


export default function Layout({children, currentAddress}) {

    const [isDarkMode, setIsDarkMode] = useState(true);

    const themeDark = createTheme({
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
                secondary: '#ffffff',
            },
        },
    });
    const themeLight = createTheme({
        palette: {
            type: 'light',
            background: {
                default: '#d6dce6',
            },
        },
    });

    const styles = {
        appbar: {
            padding: '8px',
            display: 'flex',
            color: '#b0bbf8',
            fontSize: '0.8em',
            userSelect: 'none'
        },
        footer: {
            textAlign: 'center',
            zIndex: -1,
            position: 'absolute',
            bottom: 0,
            width: '100%',
            fontSize: '0.6em',
            color: '#666',
        },
        github: {
            textDecoration: 'underline'
        },
        switcher: {
            cursor: 'pointer',
            paddingLeft: '16px',
            filter: 'grayscale(1) contrast(0.5) brightness(1.3)',
        }
    }

    const title = 'And\'s Rather Challenge';

    useEffect(() => {
        document.title = title;
    }, []);

    return (
        <>
            <ThemeProvider theme={isDarkMode ? themeDark : themeLight}>
                <CssBaseline />
                <AppBar>
                    <div style={styles.appbar}>

                        <Image src="/arcLogo.svg" alt="Vercel Logo" width={72} height={16} />
                        <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
                            { title }
                        </Typography>
                        {currentAddress && (
                            <div>
                                <span title="Connected Wallet">
                                    🦊 <small>
                                        {currentAddress.slice(0, 5)}
                                        ...
                                        {currentAddress.slice(currentAddress.length - 4, currentAddress.length)}
                                    </small>

                                </span>
                            </div>
                        )}
                        <span style={styles.switcher}
                              onClick={() => setIsDarkMode(!isDarkMode)}
                              title={`Change to ${isDarkMode ? `Light` : `Dark`} theme`}>
                            {isDarkMode ? ' 🌙' : ' 🔆'}
                        </span>
                    </div>
                </AppBar>
                <Container component="main" maxWidth="xs" sx={{
                    marginTop: themeDark.mixins.toolbar.minHeight / 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    {children}
                </Container>
            </ThemeProvider>
            <p style={styles.footer}>38
               by <a style={styles.github}
                    href="https://github.com/andna/ratherChallenge"
                    target="_blank" rel="noreferrer">
                    Andrés Bastidas Fierro
                </a> @ 2022

            </p>
        </>
    )
}
