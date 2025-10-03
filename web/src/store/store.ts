import { configureStore } from '@reduxjs/toolkit';
import medicineReducer from './slices/medicineSlice';
import alertReducer from './slices/alertSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    medicines: medicineReducer,
    alerts: alertReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
