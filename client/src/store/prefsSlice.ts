import type { Lang } from '@/types';

interface PrefsState {
  language: Lang;
  onboarded: boolean;
}

import { createSlice } from '@reduxjs/toolkit';

const prefsSlice = createSlice({
  name: 'prefs',
  initialState: { language: 'en', onboarded: false } as PrefsState,
  reducers: {
    setLanguage(state, action: { payload: Lang }) {
      state.language = action.payload;
    },
    completeOnboarding(state) {
      state.onboarded = true;
    },
    resetOnboarding(state) {
      state.onboarded = false;
    },
  },
});

export const { setLanguage, completeOnboarding, resetOnboarding } = prefsSlice.actions;
export default prefsSlice.reducer;