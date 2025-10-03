import React from 'react';
import { Medicine } from '../store/types';

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const getDaysUntilExpiry = () => {
    const expiryDate = new Date(medicine.expiry_date);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry < 0;
  const isLowStock = medicine.quantity <= medicine.min_threshold;

  return (
    <div className={`medicine-card ${isExpired ? 'expired' : isExpiringSoon ? 'expiring-soon' : ''}`}>
      <div className="medicine-name">{medicine.name}</div>

      <div className="medicine-details">
        <div className="detail-row">
          <span className="detail-label">Brand:</span>
          <span className="detail-value">{medicine.brand || 'N/A'}</span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Quantity:</span>
          <span className={`detail-value ${isLowStock ? 'low-stock' : ''}`}>
            {medicine.quantity} {isLowStock && '(Low Stock)'}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Expires:</span>
          <span className={`detail-value ${
            isExpired ? 'expired' : isExpiringSoon ? 'expiring-soon' : ''
          }`}>
            {medicine.expiry_date}
            {isExpired && ' (EXPIRED)'}
            {isExpiringSoon && ` (${daysUntilExpiry} days)`}
          </span>
        </div>

        {medicine.storage_location && (
          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{medicine.storage_location}</span>
          </div>
        )}

        <div className="detail-row">
          <span className="detail-label">Category:</span>
          <span className={`category-badge ${medicine.category}`}>
            {medicine.category.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MedicineCard;
