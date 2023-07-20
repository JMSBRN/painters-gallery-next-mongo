import { Artworks } from '@/styles/art-chicago/iInterfaces';
import React from 'react';
import { getArtWorks } from '@/styles/art-chicago/artApiUtils';
import styles from '../../styles/artChicago.module.scss';

const ArtChicago = ({ fetchedData }: { fetchedData: Artworks }) => {
  const { data } = fetchedData;

  return (
    <div className={styles.mainContainer}>
      {data.map( el => (
        <div key={el.id}>{el.id}</div>
      ))}
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