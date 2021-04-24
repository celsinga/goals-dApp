import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import ethReducer from './slices/eth';
import goalsReducer from './slices/goals';
import tasksReducer from './slices/tasks';
import notificationReducer from './slices/notification';

const store = configureStore({
  reducer: {
    eth: ethReducer,
    goals: goalsReducer,
    tasks: tasksReducer,
    notification: notificationReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
