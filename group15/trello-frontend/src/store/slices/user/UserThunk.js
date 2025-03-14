import { createAsyncThunk } from "@reduxjs/toolkit";
import httpClient from "../../../lib/httpClient";

export const authenticateUser = createAsyncThunk(
  "user/authenticate",
  async ({ email, password }) => {
    let user = null;
    try {
      user = await httpClient.post("/api/user/login", { email, password });
    } catch (e) {
      console.error(e);
    }
    console.log(user.data);
    return user.data;
  }
);

export const fetchUserWorkspaces = createAsyncThunk(
    "user/fetchUserWorkspaces",
    async (_, { rejectWithValue }) => {
        try {
            const response = await httpClient.get("/api/user/workspaces");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchAuthenticatedUser = createAsyncThunk(
  "user/authenticated",
  async () => {
    let user = null;
    try {
      user = await httpClient.get("/user/authenticated");
    } catch (e) {
      console.error(e);
    }
    console.log(user.data);
    return user.data;
  }
);