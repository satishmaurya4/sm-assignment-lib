import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'ui',
    initialState: {
        alertInfo: {
            status: '',
            message: '',
            isOpen: false,
        },
        isLoading: false,
        isContentLoading: true,
        profilePicUrl: '',
        isDeleteDialougeOpen: false,
        isDelete: false,
        uiIsAssignmentChecked: false,
        toggleUiIsAssignmentChecked: false,
    },

    reducers: {
        alert: (state, {payload}) => {
            state.alertInfo.status = payload.status;
            state.alertInfo.message = payload.message;
            state.alertInfo.isOpen = payload.isOpen;
        },
        loading: (state, {payload}) => {
            state.isLoading = payload;
        },  
        setIsContentLoading: (state, { payload }) => {
            state.isContentLoading = payload;
        },
        setProfileFilePic: (state, { payload }) => {
            state.profilePicUrl = payload;
        },
        handleDD: (state, { payload }) => {
            state.isDeleteDialougeOpen = payload;
        },
        deleteCourse: (state, { payload }) => {
            state.isDelete = payload;
        },
        setUiIsAssignmentChecked: (state, { payload }) => {
            state.uiIsAssignmentChecked = payload;
        },
        setToggleUiIsAssignmentChecked: (state) => {
            state.toggleUiIsAssignmentChecked = !state.toggleUiIsAssignmentChecked;
        }
    }
})

export const { alert,loading, setProfileFilePic, handleDD, deleteCourse,setUiIsAssignmentChecked,setToggleUiIsAssignmentChecked, setIsContentLoading } = authSlice.actions;

export default authSlice.reducer;