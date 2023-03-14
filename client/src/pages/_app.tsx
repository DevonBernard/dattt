import 'dattt/styles/globals.css'
import type { AppProps } from 'next/app'
import { SolanaWalletProvider } from 'dattt/components/wallet'
import { createTheme, ThemeProvider } from '@mui/material/styles'


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
    </ThemeProvider>
  );
}
