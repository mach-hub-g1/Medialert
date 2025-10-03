import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserSettings {
  id?: number;
  user_id?: number;
  alert_days_before: number[];
  notification_preferences: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  email_alerts: boolean;
}

interface SettingsState {
  settings: UserSettings;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: {
    alert_days_before: [7, 15, 30],
    notification_preferences: {
      email: true,
      push: true,
      sound: true,
    },
    email_alerts: true,
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<UserSettings>) => {
      state.settings = action.payload;
    },
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setSettings, updateSettings, setLoading, setError } = settingsSlice.actions;
export default settingsSlice.reducer;
