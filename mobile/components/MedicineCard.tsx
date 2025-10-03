import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Medicine } from '../store/types';

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const navigation = useNavigation();

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
    <TouchableOpacity
      style={[
        styles.card,
        isExpired && styles.expiredCard,
        isExpiringSoon && styles.expiringCard,
      ]}
      onPress={() => {
        // Navigate to medicine details (to be implemented)
      }}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.medicineName}>{medicine.name}</Text>
        <Text style={[
          styles.category,
          medicine.category === 'prescription' && styles.prescription,
          medicine.category === 'otc' && styles.otc,
          medicine.category === 'supplement' && styles.supplement,
        ]}>
          {medicine.category.toUpperCase()}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Brand:</Text>
          <Text style={styles.value}>{medicine.brand || 'N/A'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={[
            styles.value,
            isLowStock && styles.lowStockText
          ]}>
            {medicine.quantity} {isLowStock && '(Low Stock)'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Expires:</Text>
          <Text style={[
            styles.value,
            isExpired && styles.expiredText,
            isExpiringSoon && styles.expiringText,
          ]}>
            {medicine.expiry_date}
            {isExpired && ' (EXPIRED)'}
            {isExpiringSoon && ` (${daysUntilExpiry} days)`}
          </Text>
        </View>

        {medicine.storage_location && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{medicine.storage_location}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    elevation: 1,
  },
  expiredCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  expiringCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  category: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prescription: {
    backgroundColor: '#e8f5e8',
    color: '#27ae60',
  },
  otc: {
    backgroundColor: '#e8f4fd',
    color: '#2980b9',
  },
  supplement: {
    backgroundColor: '#fdf2e9',
    color: '#e67e22',
  },
  cardContent: {
    gap: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  lowStockText: {
    color: '#e67e22',
    fontWeight: 'bold',
  },
  expiredText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  expiringText: {
    color: '#f39c12',
    fontWeight: 'bold',
  },
});

export default MedicineCard;
