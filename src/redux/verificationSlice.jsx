import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';
const token = localStorage.getItem('authToken');

// Async thunk to fetch verifications
export const fetchVerifications = createAsyncThunk(
  'verification/fetchVerifications',
  async (statusFilter, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/verification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.filter((v) => v.status === statusFilter);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to approve a verification
export const approveVerification = createAsyncThunk(
  'verification/approveVerification',
  async (id, { rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/verification/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to reject a verification
export const rejectVerification = createAsyncThunk(
  'verification/rejectVerification',
  async ({ id, rejectionReason }, { rejectWithValue }) => {
    try {
      await axios.put(
        `${API_URL}/verification/${id}/reject`,
        { rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const verificationSlice = createSlice({
  name: 'verification',
  initialState: {
    verifications: [],
    selectedVerification: null,
    statusFilter: 'submitted',
    rejectionReason: '',
    isLoading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setSelectedVerification(state, action) {
      state.selectedVerification = action.payload;
    },
    setRejectionReason(state, action) {
      state.rejectionReason = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch verifications
      .addCase(fetchVerifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVerifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verifications = action.payload;
      })
      .addCase(fetchVerifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Approve verification
      .addCase(approveVerification.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(approveVerification.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.verifications = state.verifications.filter((v) => v._id !== action.payload);
        state.selectedVerification = null;
      })
      .addCase(approveVerification.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Reject verification
      .addCase(rejectVerification.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(rejectVerification.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.verifications = state.verifications.filter((v) => v._id !== action.payload);
        state.selectedVerification = null;
        state.rejectionReason = '';
      })
      .addCase(rejectVerification.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setStatusFilter,
  setSelectedVerification,
  setRejectionReason,
  clearError,
} = verificationSlice.actions;

export default verificationSlice.reducer;