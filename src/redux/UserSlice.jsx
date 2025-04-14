import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import setupAxios from "../middleware/MiddleWare";

setupAxios();

export const fetchUserData = createAsyncThunk(
  "fetchUserData/user",
  async () => {
    const response = await axios.get("/user");
    return response.data;
  }
);

export const fetchUserProfile = createAsyncThunk(
  "fetchUserProfile/user",
  async () => {
    const response = await axios.get("/user-profile");
    return response.data;
  }
);

export const editUserData = createAsyncThunk(
  "user/editUserData",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.put("/user-profile", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
          "Content-Type": "multipart/form-data",
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
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
        state.status = "success";
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
        state.status = "success";
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(editUserData.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(editUserData.fulfilled, (state, action) => {
        state.userData = action.payload; // Assuming userData is an object, not an array
        state.loading = false;
        state.status = "success";
      })
      .addCase(editUserData.rejected, (state, action) => {
        state.loading = false;
        state.status = "error";
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteUserData.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(deleteUserData.fulfilled, (state) => {
        state.userData = {}; // Clear user data on delete
        state.loading = false;
        state.status = "success";
      })
      .addCase(deleteUserData.rejected, (state, action) => {
        state.loading = false;
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(addUserData.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(addUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.loading = false;
        state.status = "success";
      })
      .addCase(addUserData.rejected, (state, action) => {
        state.loading = false;
        state.status = "error";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
