import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert as RNAlert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setAlerts, markAlertSent } from '../store/slices/alertSlice';
import { apiService } from '../services/ApiService';
import AlertBanner from '../components/AlertBanner';

const Alerts: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { alerts, loading, error } = useSelector((state: RootState) => state.alerts);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const alertsData = await apiService.checkAlerts();
      dispatch(setAlerts(alertsData));
    } catch (err) {
      console.error('Failed to load alerts:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const handleDismissAlert = (alertId: number) => {
    RNAlert.alert(
      'Dismiss Alert',
      'Are you sure you want to dismiss this alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Dismiss',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.markAlertSent(alertId);
              dispatch(markAlertSent(alertId));
            } catch (error) {
              RNAlert.alert('Error', 'Failed to dismiss alert');
            }
          },
        },
      ]
    );
  };

  const getAlertsByType = () => {
    const urgent = alerts.filter(alert => !alert.is_sent);
    const dismissed = alerts.filter(alert => alert.is_sent);

    return { urgent, dismissed };
  };

  const { urgent, dismissed } = getAlertsByType();

  const renderAlertItem = ({ item }: { item: any }) => (
    <AlertBanner
      alert={item}
      onDismiss={handleDismissAlert}
    />
  );

  const renderSection = (title: string, data: any[], emptyMessage: string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderAlertItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alerts</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Alerts List */}
      <FlatList
        data={['urgent', 'dismissed']}
        keyExtractor={(section) => section}
        renderItem={({ item: section }) => {
          if (section === 'urgent') {
            return renderSection(
              'Active Alerts',
              urgent,
              'No active alerts'
            );
          } else {
            return renderSection(
              'Dismissed Alerts',
              dismissed.slice(0, 10), // Show only recent dismissed alerts
              'No dismissed alerts'
            );
          }
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading && alerts.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No alerts found</Text>
              <Text style={styles.emptySubtext}>
                Alerts will appear here when medicines are expiring or running low on stock.
              </Text>
            </View>
          )
        }
      />
    </View>
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
  headerSpacer: {
    width: 50, // Balance the header
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
  listContainer: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default Alerts;
