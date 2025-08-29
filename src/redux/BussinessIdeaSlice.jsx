import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import setupAxios from "../middleware/MiddleWare";

setupAxios();

export const fetchBussinessIdea = createAsyncThunk(
  "fetchBussinessIdea/bussinessIdea",
  async () => {
    const response = await axios.get("/get-ideas");
    return response.data;
  }
);

export const fetchBusinessIdeaById = createAsyncThunk(
  "businessIdeas/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/get-idea/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const editBussinessIdea = createAsyncThunk(
  "bussinessIdea/editBussinessIdea",
  async ({ BussinessIdea, id }, thunkAPI) => {
    // Destructure to fix argument passing
    try {
      const response = await axios.put(`/update-idea/${id}`, BussinessIdea, {
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
          "Content-Type": "multipart/form-data",
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
    BussinessStatus: "idle",
    BussinessError: null,
  },
  reducers: {
    setBussinessIdea: (state, action) => {
      state.BussinessIdea = Array.isArray(action.payload) ? action.payload : [];
    },
    clearBussinessIdea: (state) => {
      state.BussinessIdea = [];
    },
    setSelectedBusinessIdea: (state, action) => {
      state.selectedBusinessIdea = action.payload;
      console.log("selectedBusinessIdea, action", state.selectedBusinessIdea)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBussinessIdea.pending, (state) => {
        state.bussinessIsLoading = true;
        state.BussinessStatus = "loading";
      })
      .addCase(fetchBussinessIdea.fulfilled, (state, action) => {
        state.BussinessIdea = action.payload;
        state.bussinessIsLoading = false;
        state.BussinessStatus = "success";
      })
      .addCase(fetchBussinessIdea.rejected, (state, action) => {
        state.bussinessIsLoading = false;
        state.BussinessStatus = "error";
        state.BussinessError = action.error.message;
      })
      .addCase(fetchBusinessIdeaById.pending, (state) => {
        state.bussinessIsLoading = true;
        state.BussinessStatus = "loading";
      })
      .addCase(fetchBusinessIdeaById.fulfilled, (state, action) => {
        state.selectedBusinessIdea = action.payload;
        state.bussinessIsLoading = false;
        state.BussinessStatus = "success";
      })
      .addCase(fetchBusinessIdeaById.rejected, (state, action) => {
        state.bussinessIsLoading = false;
        state.BussinessStatus = "error";
        state.BussinessError = action.payload || action.error.message;
      })
      .addCase(editBussinessIdea.pending, (state) => {
        state.bussinessIsLoading = true;
        state.BussinessStatus = "loading";
      })
      .addCase(editBussinessIdea.fulfilled, (state, action) => {
        const index = state.BussinessIdea.findIndex(
          (idea) => idea._id === action.payload._id
        );
        if (index !== -1) {
          state.BussinessIdea[index] = action.payload;
        }
        state.bussinessIsLoading = false;
        state.BussinessStatus = "success";
      })
      .addCase(editBussinessIdea.rejected, (state, action) => {
        state.bussinessIsLoading = false;
        state.BussinessStatus = "error";
        state.BussinessError = action.payload || action.error.message;
      })
      .addCase(deleteBussinessIdea.pending, (state) => {
        state.bussinessIsLoading = true;
        state.BussinessStatus = "loading";
      })
      .addCase(deleteBussinessIdea.fulfilled, (state, action) => {
        state.BussinessIdea = state.BussinessIdea.filter(
          (idea) => idea._id !== action.payload._id
        );
        state.bussinessIsLoading = false;
        state.BussinessStatus = "success";
      })
      .addCase(deleteBussinessIdea.rejected, (state, action) => {
        state.bussinessIsLoading = false;
        state.BussinessStatus = "error";
        state.BussinessError = action.error.message;
      })
      .addCase(addBussinessIdea.pending, (state) => {
        state.bussinessIsLoading = true;
        state.BussinessStatus = "loading";
      })
      .addCase(addBussinessIdea.fulfilled, (state, action) => {
        state.BussinessIdea = Array.isArray(state.BussinessIdea)
          ? [...state.BussinessIdea, action.payload]
          : [action.payload];
        state.bussinessIsLoading = false;
        state.BussinessStatus = "success";
      })
      .addCase(addBussinessIdea.rejected, (state, action) => {
        state.bussinessIsLoading = false;
        state.BussinessStatus = "error";
        state.BussinessError = action.payload || action.error.message;
      });
  },
});

export const { setBussinessIdea, clearBussinessIdea, setSelectedBusinessIdea } =
  businessIdeaSlice.actions;
export default businessIdeaSlice.reducer;
