import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as workUnitsService from '../services/workunits';
import { RelevantTokens, WorkUnitSale } from '../services/workunits';

const initialState: RelevantTokens = {
  buying: {},
  selling: {}
};

export const list = createAsyncThunk('workUnits/list', async () => {
  return await workUnitsService.listTokens();
});

export const create = createAsyncThunk('workUnits/create', async ({
  description, buyer
}: { description: string, buyer: string }) => {
  return await workUnitsService.createToken(description, buyer);
});

export const startSale = createAsyncThunk('workUnits/startSale', async ({
  token, value, tokenAddress
}: { token: WorkUnitSale, value: number, tokenAddress: string }) => {
  return await workUnitsService.startSale(token, value, tokenAddress);
});

export const cancelSale = createAsyncThunk('workUnits/cancelSale', async ({
  token
}: { token: WorkUnitSale }) => {
  return await workUnitsService.cancelSale(token);
});

export const completeSale = createAsyncThunk('workUnits/completeSale', async ({
  token
}: { token: WorkUnitSale }) => {
  return await workUnitsService.completeSale(token);
});

const workUnitsSlice = createSlice({
  name: 'workUnits',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(list.fulfilled, (state, action) => {
      state = action.payload;
    });
    builder.addCase(create.fulfilled, (state, action) => {
      state.selling[action.payload.id] = action.payload;
    });
    builder.addCase(startSale.fulfilled, (state, action) => {
      state.buying[action.payload.id] = action.payload;
    });
    builder.addCase(cancelSale.fulfilled, (state, action) => {
      if (!!state.buying[action.payload.id]) {
        state.buying[action.payload.id] = action.payload;
      } else {
        state.selling[action.payload.id] = action.payload;
      }
    });
    builder.addCase(completeSale.fulfilled, (state, action) => {
      state.buying[action.payload.id] = action.payload;
    });
  }
});

export const buyingTokensSelector = (state: { workUnits: RelevantTokens }) => {
  return state.workUnits.buying;
}

export const sellingTokensSelector = (state: { workUnits: RelevantTokens }) => {
  return state.workUnits.selling;
}

export default workUnitsSlice.reducer;
