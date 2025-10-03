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
