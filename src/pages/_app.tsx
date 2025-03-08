import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { PuzzleWalletProvider } from '@puzzlehq/sdk';
import  { Toaster } from 'react-hot-toast';
//       projectId="f0aaeffe71b636da453fce042d79d723"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PuzzleWalletProvider
     >
      <Toaster position="top-center" reverseOrder={true} />
      <Component {...pageProps} />
    </PuzzleWalletProvider>
  );
}
