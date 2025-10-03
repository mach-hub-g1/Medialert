import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Alert } from '../store/types';

interface AlertBannerProps {
  alert: Alert;
  onDismiss?: (alertId: number) => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alert, onDismiss }) => {
  const getAlertColor = () => {
    switch (alert.alert_type) {
      case 'expiry':
        return {
          backgroundColor: '#ffeaa7',
          borderColor: '#fdcb6e',
          textColor: '#d63031',
        };
      case 'low_stock':
        return {
          backgroundColor: '#fab1a0',
          borderColor: '#e17055',
          textColor: '#2d3436',
        };
      case 'reminder':
        return {
          backgroundColor: '#a29bfe',
          borderColor: '#6c5ce7',
          textColor: '#2d3436',
        };
      default:
        return {
          backgroundColor: '#ddd',
          borderColor: '#bbb',
          textColor: '#333',
        };
    }
  };

  const colors = getAlertColor();

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundColor, borderLeftColor: colors.borderColor }]}>
      <View style={styles.content}>
        <Text style={[styles.type, { color: colors.textColor }]}>
          {alert.alert_type.replace('_', ' ').toUpperCase()}
        </Text>
        <Text style={[styles.message, { color: colors.textColor }]}>
          {alert.message}
        </Text>
        <Text style={[styles.medicineName, { color: colors.textColor }]}>
          {alert.medicine_name}
        </Text>
      </View>

      {onDismiss && (
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => onDismiss(alert.id!)}
        >
          <Text style={styles.dismissText}>✓</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  type: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  medicineName: {
    fontSize: 12,
    opacity: 0.8,
  },
  dismissButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dismissText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlertBanner;
