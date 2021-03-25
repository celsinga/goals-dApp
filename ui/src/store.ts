import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import ethReducer from './slices/eth';

const store = configureStore({
  reducer: {
    eth: ethReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
