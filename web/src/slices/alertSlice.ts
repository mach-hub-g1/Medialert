import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Alert {
  id?: number;
  medicine_id: number;
  alert_type: 'expiry' | 'low_stock' | 'reminder';
  alert_date: string;
  message: string;
  is_sent: boolean;
  created_at?: string;
  medicine_name?: string;
}

interface AlertState {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
}

const initialState: AlertState = {
  alerts: [],
  loading: false,
  error: null,
};

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.alerts = action.payload;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
    },
    markAlertSent: (state, action: PayloadAction<number>) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert) {
        alert.is_sent = true;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAlerts, addAlert, markAlertSent, setLoading, setError } = alertSlice.actions;
export default alertSlice.reducer;
