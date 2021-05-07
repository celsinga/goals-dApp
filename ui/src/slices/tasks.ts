import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as taskService from '../services/tasks';
import { TaskWithId, Task } from '../services/tasks';

interface TasksState {
  tasksMap: { [goalId: number]: TaskWithId[] };
  pendingMap: { [goalId: number]: string[] };
  saveInProgress: boolean;
}

const PENDING_STORAGE_KEY = 'tasksPending';
const LAST_IDS_STORAGE_KEY = 'tasksLastIds';

const initialState: TasksState = {
  tasksMap: {},
  pendingMap: JSON.parse(window.localStorage.getItem(PENDING_STORAGE_KEY) || '{}'),
  saveInProgress: false
};

export const listActive = createAsyncThunk('tasks/listActive', async (goalId: number) => {
  const tasks = await taskService.listActive(goalId);
  return { goalId, tasks };
});

export const createBulk = createAsyncThunk('tasks/createBulk',
  async ({ goalId, descriptions }: { goalId: number, descriptions: string[] }) => {

  const tasks = await taskService.createBulk(goalId, descriptions);
  return { goalId, tasks };
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

function savePending(pending: { [goalId: number]: string[] }) {
  window.localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pending));
}

function checkLastId(tasksMap: { [goalId: number]: TaskWithId[] }, goalId: number, forceIdRemove: boolean): boolean {
  const lastIds = JSON.parse(window.localStorage.getItem(LAST_IDS_STORAGE_KEY) || '{}');
  if (lastIds[goalId] === undefined) return false;
  const tasks = tasksMap[goalId] || [];
  const result = tasks.length > 0 && tasks[tasks.length - 1].id > (lastIds[goalId] || 0);

  if (result || forceIdRemove) {
    delete lastIds[goalId];
    window.localStorage.setItem(LAST_IDS_STORAGE_KEY, JSON.stringify(lastIds));
  }

  return result;
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addToPending: (state, action: PayloadAction<{ desc: string, goalId: number }>) => {
      const goalId = action.payload.goalId;
      if (!state.pendingMap[goalId]) state.pendingMap[goalId] = [];
      state.pendingMap[goalId].push(action.payload.desc);
      savePending(state.pendingMap);
    },
    removeFromPending: (state, action: PayloadAction<{ index: number, goalId: number }>) => {
      const goalId = action.payload.goalId;
      state.pendingMap[goalId].splice(action.payload.index, 1);
      if (state.pendingMap[goalId].length === 0) delete state.pendingMap[goalId];
      savePending(state.pendingMap);
    }
  },
  extraReducers: builder => {
    builder.addCase(listActive.fulfilled, (state, action) => {
      state.tasksMap[action.payload.goalId] = action.payload.tasks;
      if (checkLastId(state.tasksMap, action.payload.goalId, false)) {
        delete state.pendingMap[action.payload.goalId];
        savePending(state.pendingMap);
      }
    });

    builder.addCase(createBulk.pending, (state, action) => {
      state.saveInProgress = true;
      const lastIds = JSON.parse(window.localStorage.getItem(LAST_IDS_STORAGE_KEY) || '{}');
      const tasks = state.tasksMap[action.meta.arg.goalId] || [];
      lastIds[action.meta.arg.goalId] = tasks.length === 0 ? 0 : tasks[tasks.length - 1].id;
      window.localStorage.setItem(LAST_IDS_STORAGE_KEY, JSON.stringify(lastIds));
    });

    builder.addCase(createBulk.rejected, (state, action) => {
      state.saveInProgress = false;
      checkLastId(state.tasksMap, action.meta.arg.goalId, true);
    });

    builder.addCase(createBulk.fulfilled, (state, action) => {
      state.saveInProgress = false;

      if (!state.tasksMap[action.payload.goalId]) state.tasksMap[action.payload.goalId] = [];

      const oldTasks = state.tasksMap[action.payload.goalId];
      state.tasksMap[action.payload.goalId] = oldTasks.concat(action.payload.tasks);

      checkLastId(state.tasksMap, action.payload.goalId, true);
      delete state.pendingMap[action.payload.goalId];
      savePending(state.pendingMap);
    });

    builder.addCase(updateDone.fulfilled, (state, action) => {
      const tasks = state.tasksMap[action.payload.goalId];
      const taskIndex = tasks.findIndex((v) => v.id === action.payload.taskId);
      if (!tasks[taskIndex]) return;
      const updatedTask = Object.assign({}, tasks[taskIndex]);
      updatedTask.task = Object.assign({}, tasks[taskIndex].task);
      updatedTask.task.done = action.payload.done;
      tasks[taskIndex] = updatedTask;
    });

    builder.addCase(updateDesc.fulfilled, (state, action) => {
      const tasks = state.tasksMap[action.payload.goalId];
      const taskIndex = tasks.findIndex((v) => v.id === action.payload.taskId);
      if (!tasks[taskIndex]) return;
      const updatedTask = Object.assign({}, tasks[taskIndex]);
      updatedTask.task = Object.assign({}, tasks[taskIndex].task);
      updatedTask.task.description = action.payload.description;
      tasks[taskIndex] = updatedTask;
    });

    builder.addCase(remove.fulfilled, (state, action) => {
      const tasks = state.tasksMap[action.payload.goalId];
      const taskIndex = tasks.findIndex((v) => v.id === action.payload.taskId);
      tasks.splice(taskIndex, 1);
    });
  }
});

export const { addToPending, removeFromPending } = tasksSlice.actions;

export const tasksSelector = (goalId: number) => (state: { tasks: TasksState }) => {
  return state.tasks.tasksMap[goalId] || [];
}
export const pendingSelector = (goalId: number) => (state: { tasks: TasksState }) => {
  return state.tasks.pendingMap[goalId] || [];
}
export const saveInProgSelector = (state: { tasks: TasksState }) => state.tasks.saveInProgress;

export default tasksSlice.reducer;
