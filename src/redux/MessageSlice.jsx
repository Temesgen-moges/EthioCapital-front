import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import setupAxios from "../middleware/MiddleWare";

setupAxios();

export const fetchUnReadMessages = createAsyncThunk(
  "fetchMessages/message",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`/user-messages/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messageDatas: [],
    isFetching: false,
    isSuccess: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnReadMessages.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchUnReadMessages.fulfilled, (state, action) => {
        state.messageDatas = action.payload;
        state.isFetching = false;
        state.isSuccess = true;
      })
      .addCase(fetchUnReadMessages.rejected, (state, action) => {
        state.isFetching = false;
        state.isSuccess = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default messageSlice.reducer;