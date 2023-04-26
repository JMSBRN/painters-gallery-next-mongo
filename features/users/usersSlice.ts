import { createSlice } from '@reduxjs/toolkit';
import { User } from '../users/interfaces';
import { RootState } from '@/srore/store';

interface InitialState {
    user: User;
}

const initialState: InitialState = {
    user: {} as User,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser: (state, action) => {
         state.user = action.payload;
        }
    }
});

export const { setUser } = usersSlice.actions;
export const selectUsers = (state: RootState) => state.users;
export default usersSlice.reducer;