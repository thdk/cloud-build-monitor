import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NextNProgress from 'nextjs-progressbar';
import { useState } from 'react';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { intitializeFirebase } from '../firebase/init-firebase';

intitializeFirebase();

function App({ Component, pageProps }: AppProps) {

  const [queryClient] = useState(() => new QueryClient())
  return (
    <>
      <NextNProgress />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ReactQueryDevtools
            initialIsOpen={false} />
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </>
  )
}

export default App;
