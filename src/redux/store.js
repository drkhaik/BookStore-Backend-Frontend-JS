import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../redux/counter/counterSlice';
import authenticationReducer from './authentication/authenticationSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    authentication: authenticationReducer,
  },
});
