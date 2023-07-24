import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../redux/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
