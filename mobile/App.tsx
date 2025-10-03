import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Dashboard from './screens/Dashboard';
import MedicineList from './screens/MedicineList';
import AddMedicine from './screens/AddMedicine';
import Alerts from './screens/Alerts';
import Settings from './screens/Settings';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ title: 'MediAlert Pro' }}
          />
          <Stack.Screen
            name="MedicineList"
            component={MedicineList}
            options={{ title: 'My Medicines' }}
          />
          <Stack.Screen
            name="AddMedicine"
            component={AddMedicine}
            options={{ title: 'Add Medicine' }}
          />
          <Stack.Screen
            name="Alerts"
            component={Alerts}
            options={{ title: 'Alerts' }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
