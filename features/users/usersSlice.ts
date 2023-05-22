import { createSlice } from '@reduxjs/toolkit';
import { User } from '../users/interfaces';
import { RootState } from '@/srore/store';

interface InitialState {
    user: User;
    logged: boolean;
}

const initialState: InitialState = {
    user: {} as User,
    logged: false,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser: (state, action) => {
         state.user = action.payload;
        },
        setLogged: (state, action) => {
         state.logged = action.payload;
        }
    }
});

export const { setUser, setLogged } = usersSlice.actions;
export const selectUsers = (state: RootState) => state.users;
export default usersSlice.reducer;