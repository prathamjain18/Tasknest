import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";
import { store } from "./store";
import Router from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

function App() {
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#ff4081',
      },
      background: {
        default: '#f4f6fb',
        paper: '#fff',
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            fontWeight: 700,
            padding: '0.7em 2em',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: '0 2px 16px rgba(25, 118, 210, 0.06)',
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
        <Provider store={store}>
          <ToastContainer />
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </Provider>
      </div>
    </ThemeProvider>
  );
}

export default App;
