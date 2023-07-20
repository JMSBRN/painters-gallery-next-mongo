import Image from 'next/image';
import React from 'react';
import artChicagoLogoImage from '../public/art-assets/art_institvte_logo.png';
import styles from '../styles/galleries.module.scss';
import { useRouter } from 'next/router';

const Galleries = () => {
 const { push } = useRouter();

  return (
    <div className={styles.mainContainer}>
      <Image 
      onClick={() => push('/art-chicago/')}
      src={artChicagoLogoImage}
      width={300}
      height={300}
      alt={''}
      />
    </div>
  );
};

export default Galleries;