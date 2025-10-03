import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setMedicines, setLoading, setError } from '../store/slices/medicineSlice';
import { setAlerts } from '../store/slices/alertSlice';
import { apiService } from '../services/ApiService';
import MedicineCard from '../components/MedicineCard';
import AlertBanner from '../components/AlertBanner';

const Dashboard: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { medicines, loading, error } = useSelector((state: RootState) => state.medicines);
  const { alerts } = useSelector((state: RootState) => state.alerts);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      dispatch(setLoading(true));
      const [medicinesData, alertsData] = await Promise.all([
        apiService.getMedicines(),
        apiService.checkAlerts(),
      ]);

      dispatch(setMedicines(medicinesData));
      dispatch(setAlerts(alertsData));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const expiringSoonMedicines = medicines.filter(medicine => {
    const expiryDate = new Date(medicine.expiry_date);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  const lowStockMedicines = medicines.filter(medicine => medicine.quantity <= medicine.min_threshold);

  const urgentAlerts = alerts.filter(alert => !alert.is_sent);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadDashboardData} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>MediAlert Pro</Text>
        <Text style={styles.subtitle}>Your Medicine Tracker</Text>
      </View>

      {/* Urgent Alerts */}
      {urgentAlerts.length > 0 && (
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Urgent Alerts</Text>
          {urgentAlerts.slice(0, 3).map(alert => (
            <AlertBanner key={alert.id} alert={alert} />
          ))}
        </View>
      )}

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statCard}>
          <Text style={styles.statNumber}>{expiringSoonMedicines.length}</Text>
          <Text style={styles.statLabel}>Expiring Soon</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard}>
          <Text style={styles.statNumber}>{lowStockMedicines.length}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard}>
          <Text style={styles.statNumber}>{medicines.length}</Text>
          <Text style={styles.statLabel}>Total Medicines</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddMedicine' as never)}
          >
            <Text style={styles.actionButtonText}>Add Medicine</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('MedicineList' as never)}
          >
            <Text style={styles.actionButtonText}>View All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Alerts' as never)}
          >
            <Text style={styles.actionButtonText}>Alerts</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Medicines */}
      {medicines.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Medicines</Text>
          {medicines.slice(0, 3).map(medicine => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </View>
      )}

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E86AB',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  alertsSection: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86AB',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  actionsSection: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#2E86AB',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  recentSection: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  errorContainer: {
    backgroundColor: '#F18F01',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Dashboard;
