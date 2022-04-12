import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import NextNProgress from 'nextjs-progressbar';
import { useState } from 'react';

import 'antd/dist/antd.css';

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <>
      <NextNProgress />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </>
  )
}

export default App;
