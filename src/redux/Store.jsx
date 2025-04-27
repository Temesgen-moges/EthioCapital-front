import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import businessIdeaReducer from './BussinessIdeaSlice';
import messageReducer from './MessageSlice';
import verificationReducer from './verificationSlice'; // Adjust path based on your folder structure

export const store = configureStore({
  reducer: {
    userData: userReducer,
    businessIdea: businessIdeaReducer,
    messageDatas: messageReducer,
    verification: verificationReducer, // Add this
  },
});