import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as goalService from '../services/goals';
import { GoalWithId, Goal } from '../services/goals';

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
  }
});

export const activeGoalsSelector = (state: { goals: GoalsState }) => state.goals.active;

export default goalsSlice.reducer;
