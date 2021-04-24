import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as goalService from '../services/goals';
import { GoalWithId, Goal } from '../services/goals';
import { NotificationAction } from './notification';

interface GoalsState {
  active: GoalWithId[]
}

const initialState: GoalsState = {
  active: []
};

export const init = createAsyncThunk('goals/init', async () => {
  return await goalService.init();
});

export const listActive = createAsyncThunk('goals/listActive', async () => {
  return await goalService.listActive();
});

export const create = createAsyncThunk('goals/create', async (goal: Goal) => {
  return await goalService.create(goal);
});

export const complete = createAsyncThunk('goals/complete', async (goalId: number) => {
  await goalService.complete(goalId);
  return goalId;
});

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(init.fulfilled, (state, action) => {
      state.active = action.payload;
    });
    builder.addCase(listActive.fulfilled, (state, action) => {
      state.active = action.payload;
    });
    builder.addCase(create.fulfilled, (state, action) => {
      state.active.unshift(action.payload);
    });
    builder.addCase(complete.fulfilled, (state, action) => {
      state.active.splice(state.active.findIndex((v) => v.id === action.payload), 1);
    });
  }
});

export const activeGoalsSelector = (state: { goals: GoalsState }) => state.goals.active;

export const notificationInfo: NotificationAction[] = [
  { action: create, desc: 'Goal creation' },
  { action: complete, desc: 'Goal completion' }
];

export default goalsSlice.reducer;
