import { Artworks } from './iInterfaces';

const getArtWorks = async () => {
    const res = await fetch('https://api.artic.edu/api/v1/artworks');
    const result: Artworks = await res.json();
    
    if(result) return result;
};

export {
    getArtWorks
};