import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as ethService from '../services/eth';

interface EthState {
  accounts: string[]
}

const initialState: EthState = {
  accounts: []
};

export const init = createAsyncThunk('eth/init', async () => {
  return await ethService.init();
});

const ethSlice = createSlice({
  name: 'eth',
  initialState,
  reducers: {

  },
  extraReducers: builder => {
    builder.addCase(init.fulfilled, (state, action) => {
      state.accounts = action.payload;
    });
  }
});

export const accountsSelector = (state: { eth: EthState }) => state.eth.accounts;

export default ethSlice.reducer;
