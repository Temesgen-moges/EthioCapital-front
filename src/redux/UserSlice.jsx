import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import setupAxios from "../middleware/MiddleWare";

setupAxios();

export const fetchUserData = createAsyncThunk(
    "fetchUserData/user",
    async () => {
        const response = await axios.get(`/user`);
        return response.data;
    }
);

export const fetchUserProfile = createAsyncThunk(
    "fetchUserProfile/user",
    async () => {
        const response = await axios.get(`/user-profile`);
        return response.data;
    }
);
export const editUserData = createAsyncThunk(
    "user/editUserData",
    async (userData, thunkAPI) => {
        try {
            const response = await axios.put(`/user-profile`, userData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Make sure to set the correct content type for file uploads
                },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const deleteUserData = createAsyncThunk(
    "user/deleteUserData",
    async (userId) => {
        const response = await axios.delete(`/user/${userId}`);
        return response.data;
    }
);

export const addUserData = createAsyncThunk(
    "user/addUserData",
    async (userData, thunkAPI) => {
        try {
            const response = await axios.post("/user-profile", userData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Make sure to set the correct content type for file uploads
                },
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: {},
        loading: false,
        status: "idle",
        error: null,
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        clearUserData: (state) => {
            state.userData = {};
        },
        
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserData.pending, (state, action) => {
            state.loading = true;
            state.status = "loading";
        });
        builder.addCase(fetchUserData.fulfilled, (state, action) => {
            state.userData = action.payload;
            state.loading = false;
            state.status = "success";
        });
        builder.addCase(fetchUserData.rejected, (state, action) => {
            state.loading = false;
            state.status = "error";
            state.error = action.error.message;
        });
        builder.addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
            state.status = "loading";
        });
        builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.userData = action.payload;
            state.loading = false;
            state.status = "success";
        });
        builder.addCase(fetchUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.status = "error";
            state.error = action.error.message;
        });
        builder.addCase(editUserData.pending, (state, action) => {
            state.loading = true;
            state.status = "loading";
        });
        builder.addCase(editUserData.fulfilled, (state, action) => {
            const index = state.userData.findIndex((user) => user._id === action.payload._id);
            if (index !== -1) {
                state.userData[index] = action.payload;
            }
            state.loading = false;
            state.status = "success";
        });
        builder.addCase(editUserData.rejected, (state, action) => {
            state.loading = false;
            state.status = "error";
            state.error = action.error.message;
        });
        builder.addCase(deleteUserData.pending, (state, action) => {
            state.loading = true;
            state.status = "loading";
        });
        builder.addCase(deleteUserData.fulfilled, (state, action) => {
            state.userData = state.userData.filter((user) => user._id !== action.payload._id);
            state.loading = false;
            state.status = "success";
        });
        builder.addCase(deleteUserData.rejected, (state, action) => {
            state.loading = false;
            state.status = "error";
            state.error = action.error.message;
        });
        builder.addCase(addUserData.pending, (state) => {
            state.loading = true;
            state.status = "loading";
        });
        builder.addCase(addUserData.fulfilled, (state, action) => {
            state.userData= action.payload;
            state.loading = false;
            state.status = "success";
        });
        builder.addCase(addUserData.rejected, (state, action) => {
            state.loading = false;
            state.status = "error";
            state.error = action.error.message;
        });
    }
})

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;