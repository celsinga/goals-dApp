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

export const updateDesc = createAsyncThunk('tasks/updateDesc',
  async ({ goalId, taskId, description }: { goalId: number, taskId: number, description: string }) => {

  await taskService.updateDesc(goalId, taskId, description);
  return { goalId, taskId, description };
});

export const remove = createAsyncThunk('tasks/remove',
  async ({ goalId, taskId }: { goalId: number, taskId: number }) => {
  await taskService.deleteTask(goalId, taskId);
  return { goalId, taskId };
})

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
      state.goalTasks[action.payload.goalId].push(action.payload.task);
    });

    builder.addCase(updateDone.fulfilled, (state, action) => {
      const tasks = state.goalTasks[action.payload.goalId];
      const taskIndex = tasks.findIndex((v) => v.id === action.payload.taskId);
      if (!tasks[taskIndex]) return;
      const updatedTask = Object.assign({}, tasks[taskIndex]);
      updatedTask.task = Object.assign({}, tasks[taskIndex].task);
      updatedTask.task.done = action.payload.done;
      tasks[taskIndex] = updatedTask;
    });

    builder.addCase(updateDesc.fulfilled, (state, action) => {
      const tasks = state.goalTasks[action.payload.goalId];
      const taskIndex = tasks.findIndex((v) => v.id === action.payload.taskId);
      if (!tasks[taskIndex]) return;
      const updatedTask = Object.assign({}, tasks[taskIndex]);
      updatedTask.task = Object.assign({}, tasks[taskIndex].task);
      updatedTask.task.description = action.payload.description;
      tasks[taskIndex] = updatedTask;
    });

    builder.addCase(remove.fulfilled, (state, action) => {
      const tasks = state.goalTasks[action.payload.goalId];
      const taskIndex = tasks.findIndex((v) => v.id === action.payload.taskId);
      tasks.splice(taskIndex, 1);
    });
  }
});

export const tasksSelector = (goalId: number) => (state: { tasks: TasksState }) => {
  return state.tasks.goalTasks[goalId]
}

export default tasksSlice.reducer;
