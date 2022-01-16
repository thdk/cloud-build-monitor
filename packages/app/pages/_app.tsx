import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { initializeApp, getApp } from "firebase/app";
import { useEffect } from 'react';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App;
