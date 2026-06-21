import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@/auth/AuthContext';
import { AlertsProvider } from '@/alerts/AlertsContext';
import { PreferencesProvider } from '@/prefs/PreferencesContext';
import RootNavigator from '@/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AlertsProvider>
          <PreferencesProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <RootNavigator />
            </NavigationContainer>
          </PreferencesProvider>
        </AlertsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
