import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as taskService from '../services/tasks';
import { TaskWithId, Task } from '../services/tasks';

interface TasksState {
  active: TaskWithId[]
}

const initialState: TasksState = {
  active: []
};

export const init = createAsyncThunk('tasks/init', async () => {
  return await taskService.init();
});

export const listActive = createAsyncThunk('tasks/listActive', async () => {
  return await taskService.listActive();
});

export const create = createAsyncThunk('tasks/create', async (task: Task) => {
  return await taskService.create(task);
});

export const complete = createAsyncThunk('tasks/complete', async (taskId: TaskWithId) => {
  await taskService.complete(taskId);
  return taskId;
});

const tasksSlice = createSlice({
  name: 'tasks',
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
    // builder.addCase(complete.fulfilled, (state, action) => {
    //   state.active.splice(state.active.findIndex((v) => v.id === action.payload), 1);
    // });
  }
});

export const activeTasksSelector = (state: { tasks: TasksState }) => state.tasks.active;

export default tasksSlice.reducer;
