import React from 'react';
import { Alert } from '../store/types';

interface AlertBannerProps {
  alert: Alert;
  onDismiss?: (alertId: number) => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alert, onDismiss }) => {
  const getAlertClass = () => {
    switch (alert.alert_type) {
      case 'expiry':
        return 'expiry';
      case 'low_stock':
        return 'low-stock';
      case 'reminder':
        return 'reminder';
      default:
        return '';
    }
  };

  return (
    <div className={`alert-item ${getAlertClass()}`}>
      <div className="alert-type">
        {alert.alert_type.replace('_', ' ').toUpperCase()}
      </div>
      <div className="alert-message">{alert.message}</div>
      <div className="alert-medicine">{alert.medicine_name}</div>

      {onDismiss && (
        <button
          className="dismiss-button"
          onClick={() => onDismiss(alert.id!)}
        >
          ✓
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
