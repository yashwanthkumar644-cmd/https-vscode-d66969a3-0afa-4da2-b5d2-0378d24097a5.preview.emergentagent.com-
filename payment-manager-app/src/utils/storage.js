import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENTS_KEY = 'pm_clients_v1';
const SETTINGS_KEY = 'pm_settings_v1';

const DEFAULT_SETTINGS = {
  businessName: 'My Business',
  currencySymbol: '₹',
};

export async function loadClients() {
  const raw = await AsyncStorage.getItem(CLIENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveClients(clients) {
  await AsyncStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export async function loadSettings() {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
