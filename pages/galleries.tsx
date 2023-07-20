import BackGroundImage from '@/components/back_ground-image/BackGroundImage';
import Image from 'next/image';
import React from 'react';
import artChicagoLogoImage from '../public/art-assets/art_institvte_logo.png';
import styles from '../styles/galleries.module.scss';
import { useRouter } from 'next/router';

const Galleries = ({ isDark }: { isDark: boolean }) => {
 const { push } = useRouter();

  return (
    <div className={styles.mainContainer}>
      <BackGroundImage isDark={isDark} />
      <Image 
      className={styles.artChicagoLogo}
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