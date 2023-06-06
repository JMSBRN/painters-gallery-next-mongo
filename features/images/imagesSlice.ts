import { ImageFromMongo } from '@/lib/interfacesforMongo';
import { RootState } from '@/srore/store';
import { createSlice } from '@reduxjs/toolkit';

interface InitialStateImagesSlice {
  images: ImageFromMongo[];
};

const initialState: InitialStateImagesSlice = {
   images: [],
};

const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
      setImages: (state, action) => {
        state.images = action.payload;
    }
  }
});

export const { setImages } = imagesSlice.actions;
export const selectImages = (state: RootState) => state.images;
export default imagesSlice.reducer;