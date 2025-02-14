import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import setupAxios from "../middleware/MiddleWare";

setupAxios();

export const fetchBussinessIdea = createAsyncThunk(
    "fetchBussinessIdea/bussinessIdea",
    async () => {
        const response = await axios.get(`/get-ideas`);
        return response.data;
    }
);

export const fetchBusinessIdeaById = createAsyncThunk(
    "businessIdeas/fetchById", // Action type updated
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/get-idea/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);
export const editBussinessIdea = createAsyncThunk(
    "bussinessIdea/editBussinessIdea",
    async (BussinessIdea,id, thunkAPI) => {
        try {
            const response = await axios.put(`/update-idea/${id}`, BussinessIdea, {
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

export const deleteBussinessIdea = createAsyncThunk(
    "bussinessIdea/deleteBussinessIdea",
    async (id) => {
        const response = await axios.delete(`/delete-idea/${id}`);
        return response.data;
    }
);

export const addBussinessIdea = createAsyncThunk(
    "bussinessIdea/addBussinessIdea",
    async (BussinessIdea, thunkAPI) => {
        try {
            const response = await axios.post("/submit-idea", BussinessIdea, {
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

const businessIdeaSlice = createSlice({
    name: "businessIdea",
    initialState: {
        BussinessIdea: {},
        selectedBusinessIdea: null,
        bussinessIsLoading: false,
        BussinessBussinessStatus: "idle",
        BussinessError: null,
    },
    reducers: {
        setBussinessIdea: (state, action) => {
          // Ensure action.payload is an array before assigning
          state.BussinessIdea = Array.isArray(action.payload) ? action.payload : [];
        },
        clearBussinessIdea: (state) => {
          state.BussinessIdea = []; // Clear the array
        },
        setSelectedBusinessIdea: (state, action) => {
            state.selectedBusinessIdea  = action.payload;
          },
      },
    extraReducers: (builder) => {
        // builder
        // .addCase(fetchBussinessIdea.pending, (state) => {
        //   state.status = 'loading';
        // })
        // .addCase(fetchBussinessIdea.fulfilled, (state, action) => {
        //   state.status = 'idle';
        //   state.BussinessIdea = action.payload;
        // })
        // .addCase(fetchBussinessIdea.rejected, (state) => {
        //   state.status = 'failed';
        // });
        builder.addCase(fetchBussinessIdea.pending, (state, action) => {
            state.bussinessIsLoading = true;
            state.BussinessStatus = "loading";
        });
        builder.addCase(fetchBussinessIdea.fulfilled, (state, action) => {
            state.BussinessIdea = action.payload;
            state.bussinessIsLoading = false;
            state.BussinessStatus = "success";
        });
        builder.addCase(fetchBussinessIdea.rejected, (state, action) => {
            state.bussinessIsLoading = false;
            state.BussinessStatus = "error";
            state.BussinessError = action.error.message;
        });
        // builder.addCase(fetchUserProfile.pending, (state) => {
        //     state.bussinessIsLoading = true;
        //     state.BussinessStatus = "bussinessIsLoading";
        // });
        // builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
        //     state.BussinessIdea = action.payload;
        //     state.bussinessIsLoading = false;
        //     state.BussinessStatus = "success";
        // });
        // builder.addCase(fetchUserProfile.rejected, (state, action) => {
        //     state.bussinessIsLoading = false;
        //     state.BussinessStatus = "error";
        //     state.error = action.error.message;
        // });
        builder.addCase(editBussinessIdea.pending, (state, action) => {
            state.bussinessIsLoading = true;
            state.BussinessStatus = "loading";
        });
        builder.addCase(editBussinessIdea.fulfilled, (state, action) => {
            const index = state.BussinessIdea.findIndex((user) => user._id === action.payload._id);
            if (index !== -1) {
                state.BussinessIdea[index] = action.payload;
            }
            state.bussinessIsLoading = false;
            state.BussinessStatus = "success";
        });
        builder.addCase(editBussinessIdea.rejected, (state, action) => {
            state.bussinessIsLoading = false;
            state.BussinessStatus = "error";
            state.BussinessError = action.error.message;
        });
        builder.addCase(deleteBussinessIdea.pending, (state, action) => {
            state.bussinessIsLoading = true;
            state.BussinessStatus = "loading";
        });
        builder.addCase(deleteBussinessIdea.fulfilled, (state, action) => {
            state.BussinessIdea = state.BussinessIdea.filter((user) => user._id !== action.payload._id);
            state.bussinessIsLoading = false;
            state.BussinessStatus = "success";
        });
        builder.addCase(deleteBussinessIdea.rejected, (state, action) => {
            state.bussinessIsLoading = false;
            state.BussinessStatus = "error";
            state.BussinessError = action.error.message;
        });
        builder.addCase(addBussinessIdea.pending, (state) => {
            state.bussinessIsLoading = true;
            state.BussinessStatus = "loading";
        });
        builder.addCase(addBussinessIdea.fulfilled, (state, action) => {
            state.BussinessIdea= action.payload;
            state.bussinessIsLoading = false;
            state.BussinessStatus = "success";
        });
        builder.addCase(addBussinessIdea.rejected, (state, action) => {
            state.bussinessIsLoading = false;
            state.BussinessStatus = "error";
            state.BussinessError = action.error.message;
        });
    }
})

export const { setBussinessIdea, clearBussinessIdea, setSelectedBusinessIdea } = businessIdeaSlice.actions;
export default businessIdeaSlice.reducer;