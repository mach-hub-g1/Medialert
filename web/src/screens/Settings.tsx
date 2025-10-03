import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert as RNAlert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setSettings, updateSettings } from '../store/slices/settingsSlice';
import { apiService } from '../services/ApiService';

const Settings: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { settings } = useSelector((state: RootState) => state.settings);

  const [localSettings, setLocalSettings] = useState(settings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const loadSettings = async () => {
    try {
      const settingsData = await apiService.getSettings();
      dispatch(setSettings(settingsData));
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await apiService.updateSettings(localSettings);
      dispatch(updateSettings(localSettings));
      RNAlert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      RNAlert.alert('Error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationPreference = (key: string, value: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [key]: value,
      },
    }));
  };

  const toggleAlertDay = (day: number) => {
    setLocalSettings(prev => ({
      ...prev,
      alert_days_before: prev.alert_days_before.includes(day)
        ? prev.alert_days_before.filter(d => d !== day)
        : [...prev.alert_days_before, day].sort((a, b) => a - b),
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={handleSaveSettings} disabled={loading}>
          <Text style={[styles.saveButton, loading && styles.saveButtonDisabled]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notification Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Email Alerts</Text>
          <Switch
            value={localSettings.notification_preferences.email}
            onValueChange={(value) => updateNotificationPreference('email', value)}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Push Notifications</Text>
          <Switch
            value={localSettings.notification_preferences.push}
            onValueChange={(value) => updateNotificationPreference('push', value)}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sound Notifications</Text>
          <Switch
            value={localSettings.notification_preferences.sound}
            onValueChange={(value) => updateNotificationPreference('sound', value)}
          />
        </View>
      </View>

      {/* Alert Timing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Timing</Text>
        <Text style={styles.sectionSubtitle}>
          Select when you want to receive expiry alerts
        </Text>

        {[7, 15, 30, 60].map((days) => (
          <TouchableOpacity
            key={days}
            style={styles.settingRow}
            onPress={() => toggleAlertDay(days)}
          >
            <Text style={styles.settingLabel}>
              {days === 7 ? '1 week' : days === 30 ? '1 month' : `${days} days`} before expiry
            </Text>
            <View style={[
              styles.checkbox,
              localSettings.alert_days_before.includes(days) && styles.checkboxSelected,
            ]}>
              {localSettings.alert_days_before.includes(days) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alert Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Settings</Text>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Email Alerts</Text>
            <Text style={styles.settingDescription}>
              Receive email notifications for important alerts
            </Text>
          </View>
          <Switch
            value={localSettings.email_alerts}
            onValueChange={(value) =>
              setLocalSettings(prev => ({ ...prev, email_alerts: value }))
            }
          />
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Export Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Import Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={() => {
            RNAlert.alert(
              'Reset Data',
              'This will delete all your medicine data. This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: () => {} },
              ]
            );
          }}
        >
          <Text style={styles.dangerButtonText}>Reset All Data</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.aboutRow}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>

        <TouchableOpacity style={styles.aboutRow}>
          <Text style={styles.settingLabel}>Privacy Policy</Text>
          <Text style={styles.settingValue}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.aboutRow}>
          <Text style={styles.settingLabel}>Terms of Service</Text>
          <Text style={styles.settingValue}>→</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    elevation: 2,
  },
  backButton: {
    fontSize: 16,
    color: '#2E86AB',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    fontSize: 16,
    color: '#2E86AB',
    fontWeight: 'bold',
  },
  saveButtonDisabled: {
    color: '#ccc',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#2E86AB',
    borderColor: '#2E86AB',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#2E86AB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});

export default Settings;
