import Image, { StaticImageData  } from 'next/image';
import React from 'react';
import styles from './backGroundImage.module.scss';

interface BackGroundImageProps {
   src: StaticImageData;
   width?: number;
}
const BackGroundImage = ({
 src,
 width,
}: BackGroundImageProps) => {

  return (
    <div>
        <Image 
        className={styles.backGroundImage}
        priority={true}
        quality={100}
        src={src}
        width={width && width | 800}
        alt='background image'
        />
    </div>
  );
};

export default BackGroundImage;