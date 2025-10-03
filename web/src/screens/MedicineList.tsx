import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setMedicines, setLoading, setError } from '../store/slices/medicineSlice';
import { apiService } from '../services/ApiService';
import MedicineCard from '../components/MedicineCard';

const MedicineList: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { medicines, loading, error } = useSelector((state: RootState) => state.medicines);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState(medicines);

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    // Filter medicines based on search query
    if (searchQuery.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.generic_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMedicines(filtered);
    }
  }, [medicines, searchQuery]);

  const loadMedicines = async () => {
    try {
      dispatch(setLoading(true));
      const medicinesData = await apiService.getMedicines();
      dispatch(setMedicines(medicinesData));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getMedicinesByCategory = () => {
    const categories = {
      prescription: filteredMedicines.filter(m => m.category === 'prescription'),
      otc: filteredMedicines.filter(m => m.category === 'otc'),
      supplement: filteredMedicines.filter(m => m.category === 'supplement'),
    };
    return categories;
  };

  const categories = getMedicinesByCategory();

  const renderMedicineItem = ({ item }: { item: any }) => (
    <MedicineCard medicine={item} />
  );

  const renderCategorySection = (title: string, data: any[]) => (
    <View style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{title}</Text>
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderMedicineItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.emptyText}>No medicines in this category</Text>
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
        <Text style={styles.headerTitle}>My Medicines</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddMedicine' as never)}>
          <Text style={styles.addButton}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Medicine List */}
      <FlatList
        data={Object.keys(categories)}
        keyExtractor={(category) => category}
        renderItem={({ item: category }) => {
          const categoryData = categories[category as keyof typeof categories];
          return renderCategorySection(
            category.charAt(0).toUpperCase() + category.slice(1),
            categoryData
          );
        }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadMedicines} />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No medicines found</Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('AddMedicine' as never)}
              >
                <Text style={styles.emptyButtonText}>Add Your First Medicine</Text>
              </TouchableOpacity>
            </View>
          )
        }
        contentContainerStyle={styles.listContainer}
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
  addButton: {
    fontSize: 16,
    color: '#2E86AB',
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
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
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
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
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#2E86AB',
    padding: 15,
    borderRadius: 10,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedicineList;
