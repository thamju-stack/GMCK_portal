import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { bootstrapApi } from '@/lib/api';
import { SAMPLE_BOOTSTRAP } from '@/lib/sampleData';
import type { BootstrapData } from '@/types';

export const bootstrapFetch = createAsyncThunk(
  'bootstrap/fetch',
  async (): Promise<BootstrapData> => {
    try {
      return await bootstrapApi.fetch();
    } catch {
      return SAMPLE_BOOTSTRAP;
    }
  },
);

interface BootstrapState {
  data: BootstrapData;
  status: 'idle' | 'loading' | 'ok' | 'error';
}

const bootstrapSlice = createSlice({
  name: 'bootstrap',
  initialState: { data: SAMPLE_BOOTSTRAP, status: 'idle' } as BootstrapState,
  reducers: {
    setBootstrap(state, action: { payload: BootstrapData }) {
      state.data = action.payload;
      state.status = 'ok';
    },
  },
  extraReducers: (b) => {
    b.addCase(bootstrapFetch.pending, (s) => {
      s.status = 'loading';
    });
    b.addCase(bootstrapFetch.fulfilled, (s, a) => {
      s.data = a.payload;
      s.status = 'ok';
    });
    b.addCase(bootstrapFetch.rejected, (s) => {
      s.status = 'error';
    });
  },
});

export const { setBootstrap } = bootstrapSlice.actions;
export default bootstrapSlice.reducer;