import React, { useEffect, useState } from 'react';

const Galleries = () => {
  const [data, setData ] = useState(null);
  
  useEffect(() => {
    const fn = async () => {
     const resFetch = await fetch('https://api.artic.edu/api/v1/artworks');
     const result = await resFetch.json();

     if(result) setData(result);
    };

    fn();

  }, []);
  
  return (
    <div>{JSON.stringify(data)}</div>
  );
};

export default Galleries;