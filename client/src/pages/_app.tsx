import 'dattt/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
import { SolanaWalletProvider } from 'dattt/components/wallet'


const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#512da8',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      paper: '#27272a',
      default: '#18181b',
    },
    // @ts-ignore
    contrast: {
      main: '#ccc'
    }
  }
});


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <SolanaWalletProvider>
        <Component {...pageProps} />
      </SolanaWalletProvider>
      <ToastContainer
          theme="dark"
          position="bottom-left"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
        />
    </ThemeProvider>
  );
}
