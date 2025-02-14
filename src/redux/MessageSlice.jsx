import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import setupAxios from "../middleware/MiddleWare";

setupAxios();

export const fetchUnReadMessages = createAsyncThunk(
    "fetchMessages/message",
    async (userId, thunkAPI) => {
        try {
            const response = await axios.get(`/fetch-messages-for-user/${userId}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
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
    extraReducers: (builder)=>{
        builder.addCase(fetchUnReadMessages.pending, (state)=>{
            state.isFetching= true
        });
        builder.addCase(fetchUnReadMessages.fulfilled, (state,action)=>{
            state.messageDatas= action.payload;
            state.isFetching= false;
            state.isSuccess=true
        });
        builder.addCase(fetchUnReadMessages.rejected, (state,action)=>{
            state.isFetching=false;
        })
    }

});

export default messageSlice.reducer;