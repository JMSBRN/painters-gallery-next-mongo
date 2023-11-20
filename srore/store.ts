import { configureStore } from '@reduxjs/toolkit';
import imagesReducer from '../features/images/imagesSlice';
import usersReducer from '../features/users/usersSlice';

const store = configureStore({
    reducer: {
      users:  usersReducer,
      images:  imagesReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType <typeof store.getState>;
export default store;