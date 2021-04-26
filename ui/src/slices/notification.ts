import { createSlice, AsyncThunk } from '@reduxjs/toolkit';
import * as tasksSlice from '../slices/tasks';
import * as goalsSlice from '../slices/goals';
import * as workUnitsSlice from '../slices/workunits';

interface NotifyState {
  msg: string | null;
  severity: 'success' | 'error' | 'info';
  inProgress: boolean;
}

const initialState: NotifyState = {
  msg: null,
  severity: 'info',
  inProgress: false
};

const notificationInfo = [
  { action: goalsSlice.create, desc: 'Goal creation' },
  { action: goalsSlice.complete, desc: 'Goal completion' },
  { action: tasksSlice.create, desc: 'Task creation' },
  { action: tasksSlice.updateDone, desc: 'Task update' },
  { action: tasksSlice.updateDesc, desc: 'Task update' },
  { action: tasksSlice.remove, desc: 'Task removal' },
  { action: workUnitsSlice.list, desc: 'Listing work units', onlyReportFail: true },
  { action: workUnitsSlice.create, desc: 'Work unit creation' },
  { action: workUnitsSlice.startSale, desc: 'Work unit escrow' },
  { action: workUnitsSlice.cancelSale, desc: 'Work unit cancellation' },
  { action: workUnitsSlice.completeSale, desc: 'Work unit purchase' },
];

const notifySlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: builder => {
    for (const notifyInfo of notificationInfo) {
      if (!notifyInfo.onlyReportFail) {
        builder.addCase(notifyInfo.action.pending, (state, action) => {
          state.msg = `${notifyInfo.desc} in progress...`;
          state.inProgress = true;
          state.severity = 'info';
        });
        builder.addCase(notifyInfo.action.fulfilled, (state, action) => {
          state.msg = `${notifyInfo.desc} complete!`;
          state.inProgress = false;
          state.severity = 'success';
        });
      }
      builder.addCase(notifyInfo.action.rejected, (state, action) => {
        state.msg = `${notifyInfo.desc} failed! Error: ${action.error.message}`;
        state.inProgress = false;
        state.severity = 'error';
      });
    }
  }
});

export const notifySelector = (state: { notification: NotifyState }) => state.notification;

export default notifySlice.reducer;
