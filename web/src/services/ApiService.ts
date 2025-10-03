import { Medicine, Alert, UserSettings } from '../store/types';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  async getMedicines(): Promise<Medicine[]> {
    const response = await fetch(`${API_BASE_URL}/medicines`);
    if (!response.ok) {
      throw new Error('Failed to fetch medicines');
    }
    return response.json();
  }

  async addMedicine(medicine: Omit<Medicine, 'id' | 'created_at'>): Promise<Medicine> {
    const response = await fetch(`${API_BASE_URL}/medicines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicine),
    });

    if (!response.ok) {
      throw new Error('Failed to add medicine');
    }

    return response.json();
  }

  async updateMedicine(id: number, medicine: Partial<Medicine>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medicine),
    });

    if (!response.ok) {
      throw new Error('Failed to update medicine');
    }
  }

  async deleteMedicine(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete medicine');
    }
  }

  async checkAlerts(): Promise<Alert[]> {
    const response = await fetch(`${API_BASE_URL}/alerts/check`);
    if (!response.ok) {
      throw new Error('Failed to check alerts');
    }
    return response.json();
  }

  async getAlerts(): Promise<Alert[]> {
    const response = await fetch(`${API_BASE_URL}/alerts`);
    if (!response.ok) {
      throw new Error('Failed to fetch alerts');
    }
    return response.json();
  }

  async markAlertSent(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}/sent`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Failed to mark alert as sent');
    }
  }

  async getSettings(): Promise<UserSettings> {
    const response = await fetch(`${API_BASE_URL}/settings`);
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    return response.json();
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
  }
}

export const apiService = new ApiService();
