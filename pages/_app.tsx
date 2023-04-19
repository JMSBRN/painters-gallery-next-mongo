import type { AppProps } from 'next/app';
import '../styles/main.scss';
import Layout from '@/components/layout/Layout';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Footer />
    </>
  );
}
