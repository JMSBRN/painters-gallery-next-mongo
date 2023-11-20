import { ImageFromImgBb } from '@/interfaces/interfacesforImgBb';
import { ImageFromMongo } from '@/interfaces/interfacesforMongo';
import { RootState } from '@/srore/store';
import { createSlice } from '@reduxjs/toolkit';

interface InitialStateImagesSlice {
  images: ImageFromMongo[];
  imagesImgBB: ImageFromImgBb[];
};

const initialState: InitialStateImagesSlice = {
   images: [],
   imagesImgBB: []
};

const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
      setImages: (state, action) => {
        state.images = action.payload;
    },
      setImagesImgBb: (state, action) => {
        state.imagesImgBB = action.payload;
    }
  }
});

export const { setImages, setImagesImgBb } = imagesSlice.actions;
export const selectImages = (state: RootState) => state.images;
export default imagesSlice.reducer;