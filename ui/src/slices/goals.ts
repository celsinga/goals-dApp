import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as goalService from '../services/goals';
import { GoalWithId, Goal } from '../services/goals';

interface GoalsState {
  active: GoalWithId[];
  pending: Goal[];
  saving: Goal[];
}

const CREATE_STORAGE_KEY = 'goalsToCreate';

const initialState: GoalsState = {
  active: [],
  pending: JSON.parse(window.localStorage.getItem(CREATE_STORAGE_KEY) || '[]'),
  saving: []
};

export const init = createAsyncThunk('goals/init', async () => {
  return await goalService.init();
});

export const listActive = createAsyncThunk('goals/listActive', async () => {
  return await goalService.listActive();
});

export const createBulk = createAsyncThunk('goals/createBulk', async (goals: Goal[]) => {
  return await goalService.createBulk(goals);
});

export const complete = createAsyncThunk('goals/complete', async (goalId: number) => {
  await goalService.complete(goalId);
  return goalId;
});

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addToPending: (state, action: PayloadAction<Goal>) => {
      state.pending.unshift(action.payload);
      window.localStorage.setItem(CREATE_STORAGE_KEY, JSON.stringify(state.pending));
    },
    removeFromPending: (state, action: PayloadAction<number>) => {
      state.pending.splice(action.payload, 1);
      window.localStorage.setItem(CREATE_STORAGE_KEY, JSON.stringify(state.pending));
    }
  },
  extraReducers: builder => {
    builder.addCase(init.fulfilled, (state, action) => {
      state.active = action.payload;
    });
    builder.addCase(listActive.fulfilled, (state, action) => {
      state.active = action.payload;
    });
    builder.addCase(createBulk.pending, (state, action) => {
      state.saving = state.pending;
      state.pending = [];
      window.localStorage.removeItem(CREATE_STORAGE_KEY);
    });
    builder.addCase(createBulk.rejected, (state, action) => {
      state.pending = state.saving;
      state.saving = [];
      window.localStorage.setItem(CREATE_STORAGE_KEY, JSON.stringify(state.pending));
    });
    builder.addCase(createBulk.fulfilled, (state, action) => {
      state.active = action.payload.slice().reverse().concat(state.active);
      state.saving = [];
    });
    builder.addCase(complete.fulfilled, (state, action) => {
      state.active.splice(state.active.findIndex((v) => v.id === action.payload), 1);
    });
  }
});

export const { addToPending, removeFromPending } = goalsSlice.actions;

export const activeGoalsSelector = (state: { goals: GoalsState }) => state.goals.active;
export const pendingGoalsSelector = (state: { goals: GoalsState }) => state.goals.pending;

export default goalsSlice.reducer;
