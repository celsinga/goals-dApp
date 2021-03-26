import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import ethReducer from './slices/eth';
import goalsReducer from './slices/goals';

const store = configureStore({
  reducer: {
    eth: ethReducer,
    goals: goalsReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
