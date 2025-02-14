import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import businessIdeaReducer from "./BussinessIdeaSlice";
import messageReducer from "./MessageSlice";


export const store = configureStore({
    reducer: {
        userData: userReducer,
        businessIdea: businessIdeaReducer,
        messageDatas: messageReducer,
    },
});