import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as taskService from '../services/tasks';
import { TaskWithId, Task } from '../services/tasks';

interface TasksState {
  goalTasks: { [goalId: number]: TaskWithId[] }
}

const initialState: TasksState = {
  goalTasks: {}
};

export const init = createAsyncThunk('tasks/init', async () => {
  await taskService.init();
});

export const listActive = createAsyncThunk('tasks/listActive', async (goalId: number) => {
  const tasks = await taskService.listActive(goalId);
  return { goalId, tasks };
});

export const create = createAsyncThunk('tasks/create',
  async ({ goalId, description }: { goalId: number, description: string }) => {

  const task = await taskService.create(goalId, description);
  return { goalId, task };
});

export const updateDone = createAsyncThunk('tasks/updateDone',
  async ({ goalId, taskId, done }: { goalId: number, taskId: number, done: boolean }) => {

  await taskService.updateDone(goalId, taskId, done);
  return { goalId, taskId, done };
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(listActive.fulfilled, (state, action) => {
      state.goalTasks[action.payload.goalId] = action.payload.tasks;
    });
    builder.addCase(create.fulfilled, (state, action) => {
      if (!state.goalTasks[action.payload.goalId]) {
        state.goalTasks[action.payload.goalId] = [];
      }
      state.goalTasks[action.payload.goalId].unshift(action.payload.task);
    });
    builder.addCase(updateDone.fulfilled, (state, action) => {
      const task = state.goalTasks[action.payload.goalId].find((v) => v.id === action.payload.taskId);
      if (!task) return;
      task.task.done = action.payload.done;
    });
  }
});

export const activeTasksSelector = (state: { tasks: TasksState }, goalId: number) => {
  return state.tasks.goalTasks[goalId]
}

export default tasksSlice.reducer;
