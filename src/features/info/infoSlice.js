import { createSlice } from '@reduxjs/toolkit';

const infoSlice = createSlice({
    name: 'info',
    initialState: {
        
            users: [],
            courses: [],
            // createdAssignments: [],
            // downloadedAssignments: [],
            // uploadedAssignments: [],
        

    },
    reducers: {
        getUsers: (state, { payload }) => {
           
            state.users = payload;
            
            // records.createdAssignments = payload.createdAssignments;
            // records.downloadedAssignments = payload.downloadedAssignments;
            // records.uploadedAssignments = payload.uploadedAssignments;

        },
        getCourses: (state, { payload }) => {
           
            state.courses = payload;
            // records.createdAssignments = payload.createdAssignments;
            // records.downloadedAssignments = payload.downloadedAssignments;
            // records.uploadedAssignments = payload.uploadedAssignments;

        },
    }
})


export const { getUsers, getCourses } = infoSlice.actions;


export default infoSlice.reducer;