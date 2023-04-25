import { createSlice } from '@reduxjs/toolkit';
import { User } from '../users/interfaces';
import { RootState } from '@/srore/store';

interface InitialState {
    user: User;
}

const initialState: InitialState = {
    user: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    },
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser: (state, action) => {
         state.user = action.payload;
         console.log(state.user);
        }
    }
});

export const { setUser } = usersSlice.actions;
export const selectUser = (state: RootState) => state.users;
export default usersSlice.reducer;