import { Artworks } from '@/styles/art-chicago/iInterfaces';
import Image from 'next/image';
import PaginationArtChicago from './components/pagination/PaginationArtChicago';
import React from 'react';
import SearchForm from './components/search-form/SearchForm';
import { getArtWorks } from '@/styles/art-chicago/artApiUtils';
import styles from '../../styles/artChicago.module.scss';

const ArtChicago = ({ fetchedData }: { fetchedData: Artworks }) => {
  const { mainContainer, artWorks, imageConatiner, searchFormContainer } = styles;

  const { data, pagination } = fetchedData;
  const { total, total_pages, current_page } = pagination;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChangePage = (_: any, page: number) => {
    console.log(page);
  };
    
  return (
    <div className={mainContainer}>
      <div className="total">total: {total}</div>
      <PaginationArtChicago 
      totalPages={total_pages}
      currentPage={current_page}
      handleChangePage={handleChangePage}
      />
      <div className={searchFormContainer}>
        <SearchForm  handleSubmit={handleSubmit} handleChange={handleChange} />
      </div>
      <div className={artWorks}>
      {data.map( el => (
        <div key={el.id}>
          <div className={imageConatiner}>
            <Image 
            src={`https://www.artic.edu/iiif/2/${el.image_id}/full/400,/0/default.jpg`}
            width={100}
            height={120}
            alt='alt data'
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