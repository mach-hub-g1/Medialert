import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { addMedicine } from '../store/slices/medicineSlice';
import { apiService } from '../services/ApiService';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddMedicine: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    generic_name: '',
    category: 'otc' as 'prescription' | 'otc' | 'supplement',
    expiry_date: '',
    purchase_date: '',
    quantity: '',
    min_threshold: '5',
    batch_number: '',
    manufacturer: '',
    price: '',
    storage_location: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<'expiry' | 'purchase' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && datePickerTarget) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange(datePickerTarget === 'expiry' ? 'expiry_date' : 'purchase_date', formattedDate);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim() || !formData.expiry_date) {
      Alert.alert('Error', 'Please fill in at least the medicine name and expiry date.');
      return;
    }

    setLoading(true);
    try {
      const medicineData = {
        name: formData.name.trim(),
        brand: formData.brand.trim() || undefined,
        generic_name: formData.generic_name.trim() || undefined,
        category: formData.category,
        expiry_date: formData.expiry_date,
        purchase_date: formData.purchase_date || new Date().toISOString().split('T')[0],
        quantity: parseInt(formData.quantity) || 0,
        min_threshold: parseInt(formData.min_threshold) || 5,
        batch_number: formData.batch_number.trim() || undefined,
        manufacturer: formData.manufacturer.trim() || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        storage_location: formData.storage_location.trim() || undefined,
      };

      const result = await apiService.addMedicine(medicineData);
      dispatch(addMedicine(result));

      Alert.alert(
        'Success',
        'Medicine added successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Add New Medicine</Text>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Medicine Name *"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Brand"
            value={formData.brand}
            onChangeText={(value) => handleInputChange('brand', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Generic Name"
            value={formData.generic_name}
            onChangeText={(value) => handleInputChange('generic_name', value)}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryOptions}>
              {(['prescription', 'otc', 'supplement'] as const).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    formData.category === category && styles.categoryOptionSelected,
                  ]}
                  onPress={() => handleInputChange('category', category)}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    formData.category === category && styles.categoryOptionTextSelected,
                  ]}>
                    {category.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Dates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Important Dates</Text>

          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => {
              setDatePickerTarget('expiry');
              setShowDatePicker(true);
            }}
          >
            <Text style={formData.expiry_date ? styles.dateText : styles.datePlaceholder}>
              {formData.expiry_date || 'Select Expiry Date *'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => {
              setDatePickerTarget('purchase');
              setShowDatePicker(true);
            }}
          >
            <Text style={formData.purchase_date ? styles.dateText : styles.datePlaceholder}>
              {formData.purchase_date || 'Select Purchase Date'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inventory */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory</Text>

          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={formData.quantity}
            onChangeText={(value) => handleInputChange('quantity', value)}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Minimum Threshold (default: 5)"
            value={formData.min_threshold}
            onChangeText={(value) => handleInputChange('min_threshold', value)}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Storage Location"
            value={formData.storage_location}
            onChangeText={(value) => handleInputChange('storage_location', value)}
          />
        </View>

        {/* Additional Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Details</Text>

          <TextInput
            style={styles.input}
            placeholder="Batch Number"
            value={formData.batch_number}
            onChangeText={(value) => handleInputChange('batch_number', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Manufacturer"
            value={formData.manufacturer}
            onChangeText={(value) => handleInputChange('manufacturer', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Price"
            value={formData.price}
            onChangeText={(value) => handleInputChange('price', value)}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={datePickerTarget === 'purchase' ? undefined : new Date()}
          />
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Adding Medicine...' : 'Add Medicine'}
          </Text>
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
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  categoryOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryOptionSelected: {
    backgroundColor: '#2E86AB',
    borderColor: '#2E86AB',
  },
  categoryOptionText: {
    color: '#666',
    fontWeight: '500',
  },
  categoryOptionTextSelected: {
    color: 'white',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  datePlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#2E86AB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddMedicine;
