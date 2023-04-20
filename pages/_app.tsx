import type { AppProps } from 'next/app';
import '../styles/main.scss';
import Layout from '@/components/layout/Layout';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { SetStateAction, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [isDark, setIsDark] = useState<boolean>(false);
  return (
    <div className={isDark ? 'theme-dark' :'theme'}>
      <Header isDark={isDark} setIsDark={setIsDark}  />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Footer />
    </div>
  );
}
