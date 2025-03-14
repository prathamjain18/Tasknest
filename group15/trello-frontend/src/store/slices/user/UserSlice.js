import { createSlice } from "@reduxjs/toolkit";
import { authenticateUser, fetchUserWorkspaces } from "./UserThunk";

const initialState = {
    details: {
        data: {},
        isFetching: false,
    },
    authenticate: {
        data: null,
        isFetching: false,
    },
    workspaces: [],
};

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.data = action.payload;
        },

        setAuthenticate: (state, action) => {
            state.authenticate.data = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authenticateUser.fulfilled, (state, action) => {
            state.authenticate.data = action.payload.data.token;
            state.authenticate.isFetching = false;
        });

        builder.addCase(authenticateUser.pending, (state) => {
            state.authenticate.isFetching = true;
        });

        builder.addCase(fetchUserWorkspaces.fulfilled, (state, action) => {
            state.workspaces = action.payload;
        });
    },
})

export const { setUser, setAuthenticate } = UserSlice.actions

export default UserSlice.reducer