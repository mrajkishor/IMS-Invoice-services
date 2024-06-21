import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
// import other reducers as needed

const rootReducer = combineReducers({
    auth: authReducer,
    // add other reducers here
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
