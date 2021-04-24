import { createSlice, AsyncThunk } from '@reduxjs/toolkit';
import { notificationInfo as tasksNotificationInfo } from '../slices/tasks';
import { notificationInfo as goalsNotificationInfo } from '../slices/goals';

export interface NotificationAction {
  action: AsyncThunk<any, any, {}>,
  desc: string
}

interface NotifyState {
  msg: string | null;
  severity: 'success' | 'error' | 'info';
}

const initialState: NotifyState = {
  msg: null,
  severity: 'info'
};

let allNotificationInfo: NotificationAction[] = [];
allNotificationInfo = allNotificationInfo.concat(tasksNotificationInfo, goalsNotificationInfo);

const notifySlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clear(state) {
      state.msg = null;
    }
  },
  extraReducers: builder => {
    for (const notifyInfo of allNotificationInfo) {
      builder.addCase(notifyInfo.action.pending, (state, action) => {
        state.msg = `${notifyInfo.desc} in progress...`;
        state.severity = 'info';
      });
      builder.addCase(notifyInfo.action.fulfilled, (state, action) => {
        state.msg = `${notifyInfo.desc} complete!`;
        state.severity = 'success';
      });
      builder.addCase(notifyInfo.action.rejected, (state, action) => {
        state.msg = `${notifyInfo.desc} failed! Error: ${action.error.message}`;
        state.severity = 'error';
      });
    }
  }
});

export const notifySelector = (state: { notification: NotifyState }) => state.notification;

export const { clear } = notifySlice.actions;

export default notifySlice.reducer;
