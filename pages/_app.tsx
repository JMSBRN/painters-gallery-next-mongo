import type { AppProps } from 'next/app';
import '../styles/main.scss';
import Layout from '@/components/layout/Layout';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { useState } from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import store from '@/srore/store';

export default function App({ Component, pageProps }: AppProps) {
  const [isDark, setIsDark] = useState<boolean>(false);
  return (
    <>
      <Head>
        <title>Painters-Gallery</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider store={store}>
        <div className={isDark ? 'theme-dark' : 'theme'}>
          <Header isDark={isDark} setIsDark={setIsDark} />
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Footer />
        </div>
      </Provider>
    </>
  );
}
