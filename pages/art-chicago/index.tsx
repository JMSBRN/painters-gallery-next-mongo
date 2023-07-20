import { Artworks } from '@/styles/art-chicago/iInterfaces';
import Image from 'next/image';
import React from 'react';
import { getArtWorks } from '@/styles/art-chicago/artApiUtils';
import styles from '../../styles/artChicago.module.scss';

const ArtChicago = ({ fetchedData }: { fetchedData: Artworks }) => {
  const { mainContainer, artWorks, imageConatiner } = styles;

  const { data } = fetchedData;
    
  return (
    <div className={mainContainer}>
      <div className={artWorks}>
      {data.map( el => (
        <div key={el.id}>
          <div className={imageConatiner}>
            <Image 
            src={`https://www.artic.edu/iiif/2/${el.image_id}/full/400,/0/default.jpg`}
            width={100}
            height={120}
            alt={el.thumbnail.alt_text}
            />
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export const  getStaticProps = async () => {
  const fetchedData: Artworks = await getArtWorks() || {} as Artworks;

   if(fetchedData) {
     return {
      props: {
        fetchedData
      }
     };
   }
};

export default ArtChicago;