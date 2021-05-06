import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as goalService from '../services/goals';
import { GoalWithId, Goal } from '../services/goals';

interface GoalsState {
  active: GoalWithId[];
  pending: Goal[];
  saveInProgress: boolean;
}

const PENDING_STORAGE_KEY = 'goalsPending';
const LAST_ID_STORAGE_KEY = 'goalsLastId';

const initialState: GoalsState = {
  active: [],
  pending: JSON.parse(window.localStorage.getItem(PENDING_STORAGE_KEY) || '[]'),
  saveInProgress: false
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

function savePending(pending: Goal[]) {
  window.localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pending));
}

function checkForUnknownSave(active: GoalWithId[]): boolean {
  const lastId = parseInt(window.localStorage.getItem(LAST_ID_STORAGE_KEY) || '0');
  return active.length > 0 && active[0].id > lastId;
}

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addToPending: (state, action: PayloadAction<Goal>) => {
      state.pending.unshift(action.payload);
      savePending(state.pending);
    },
    removeFromPending: (state, action: PayloadAction<number>) => {
      state.pending.splice(action.payload, 1);
      savePending(state.pending);
    }
  },
  extraReducers: builder => {
    builder.addCase(init.fulfilled, (state, action) => {
      state.active = action.payload;
      if (checkForUnknownSave(state.active)) {
        state.pending = [];
        savePending(state.pending);  
      }
    });
    builder.addCase(listActive.fulfilled, (state, action) => {
      state.active = action.payload;
      if (checkForUnknownSave(state.active)) {
        state.pending = [];
        savePending(state.pending);  
      }
    });
    builder.addCase(createBulk.pending, (state, action) => {
      const lastId = state.active.length === 0 ? 0 : state.active[0].id;
      window.localStorage.setItem(LAST_ID_STORAGE_KEY, lastId.toString());
      state.saveInProgress = true;
    });
    builder.addCase(createBulk.rejected, (state, action) => {
      window.localStorage.removeItem(LAST_ID_STORAGE_KEY);
      state.saveInProgress = false;
    });
    builder.addCase(createBulk.fulfilled, (state, action) => {
      window.localStorage.removeItem(LAST_ID_STORAGE_KEY);
      state.saveInProgress = false;
      state.active = action.payload.slice().reverse().concat(state.active);
      state.pending = [];
      savePending(state.pending);
    });
    builder.addCase(complete.fulfilled, (state, action) => {
      state.active.splice(state.active.findIndex((v) => v.id === action.payload), 1);
    });
  }
});

export const { addToPending, removeFromPending } = goalsSlice.actions;

export const activeGoalsSelector = (state: { goals: GoalsState }) => state.goals.active;
export const pendingGoalsSelector = (state: { goals: GoalsState }) => state.goals.pending;
export const saveInProgSelector = (state: { goals: GoalsState }) => state.goals.saveInProgress;

export default goalsSlice.reducer;
