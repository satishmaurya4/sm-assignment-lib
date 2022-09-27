import { createSlice } from '@reduxjs/toolkit';


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loggedUser: JSON.parse(localStorage.getItem('user')),
        isLogin: null,
        
    },
    
    reducers: {
        getLoggedUser: (state, {payload}) => {
            state.loggedUser = payload
        },
        setUser: (state, { payload }) => {
            state.loggedUser = payload;
        },
        checkLogin: (state, { payload }) => {
            state.isLogin=  payload
        }
    }
})


export const { getLoggedUser, checkLogin, setUser } = authSlice.actions;

export default authSlice.reducer;