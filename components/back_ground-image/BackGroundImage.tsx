import Image from 'next/image';
import React from 'react';
import backGroundImageDark from '../../public/images/tree-736885_1280.jpg';
import backGroundImageLight from '../../public/images/sea.jpg';
import styles from './backGroundImage.module.scss';

interface BackGroundImageProps {
   isDark: boolean;
   width?: number;
}
const BackGroundImage = ({
 isDark,
 width,
}: BackGroundImageProps) => {

  return (
    <div>
        <Image 
        className={styles.backGroundImage}
        priority={true}
        quality={100}
        src={isDark ? backGroundImageDark : backGroundImageLight}
        width={width && width | 800}
        alt='background image'
        />
    </div>
  );
};

export default BackGroundImage;