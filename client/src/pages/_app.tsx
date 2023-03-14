import 'dattt/styles/globals.css'
import type { AppProps } from 'next/app'
import { SolanaWalletProvider } from 'dattt/components/wallet'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <SolanaWalletProvider>
      <Component {...pageProps} />
    </SolanaWalletProvider>
  );
}
