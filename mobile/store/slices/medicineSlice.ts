import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Medicine {
  id?: number;
  name: string;
  brand?: string;
  generic_name?: string;
  category: 'prescription' | 'otc' | 'supplement';
  expiry_date: string;
  purchase_date?: string;
  quantity: number;
  min_threshold: number;
  batch_number?: string;
  manufacturer?: string;
  price?: number;
  storage_location?: string;
  created_at?: string;
}

interface MedicineState {
  medicines: Medicine[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicineState = {
  medicines: [],
  loading: false,
  error: null,
};

const medicineSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {
    setMedicines: (state, action: PayloadAction<Medicine[]>) => {
      state.medicines = action.payload;
    },
    addMedicine: (state, action: PayloadAction<Medicine>) => {
      state.medicines.push(action.payload);
    },
    updateMedicine: (state, action: PayloadAction<Medicine>) => {
      const index = state.medicines.findIndex(med => med.id === action.payload.id);
      if (index !== -1) {
        state.medicines[index] = action.payload;
      }
    },
    deleteMedicine: (state, action: PayloadAction<number>) => {
      state.medicines = state.medicines.filter(med => med.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMedicines, addMedicine, updateMedicine, deleteMedicine, setLoading, setError } = medicineSlice.actions;
export default medicineSlice.reducer;
