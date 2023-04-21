import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/users/usersSlice';

const store = configureStore({
    reducer: {
        usersReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType <typeof store.getState>;
export default store;