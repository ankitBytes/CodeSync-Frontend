import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    email: ""
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.currentUser = action.payload;
        },
        logout: (state) => {
            state.currentUser = null;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        clearEmail: (state) => {
            state.email = "";
        }
    }
})

export const { loginSuccess, logout, setEmail, clearEmail } = userSlice.actions;
export default userSlice.reducer;