import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/users/usersSlice';
import imagesReducer from '../features/images/imagesSlice';

const store = configureStore({
    reducer: {
      users:  usersReducer,
      images:  imagesReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType <typeof store.getState>;
export default store;