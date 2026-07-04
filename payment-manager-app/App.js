import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import ClientListScreen from './src/screens/ClientListScreen';
import ClientFormScreen from './src/screens/ClientFormScreen';
import ClientDetailScreen from './src/screens/ClientDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { loadClients, saveClients, loadSettings, saveSettings } from './src/utils/storage';
import { generateId } from './src/utils/id';

// screen: 'list' | 'form' | 'detail' | 'settings'
export default function App() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [settings, setSettings] = useState({ businessName: 'My Business', currencySymbol: '₹' });
  const [screen, setScreen] = useState('list');
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    (async () => {
      const [c, s] = await Promise.all([loadClients(), loadSettings()]);
      setClients(c);
      setSettings(s);
      setLoading(false);
    })();
  }, []);

  const persistClients = useCallback(async (next) => {
    setClients(next);
    await saveClients(next);
  }, []);

  function handleAddClient() {
    setEditingClient(null);
    setScreen('form');
  }

  function handleSelectClient(client) {
    setSelectedClient(client);
    setScreen('detail');
  }

  function handleEditClient() {
    setEditingClient(selectedClient);
    setScreen('form');
  }

  async function handleSaveClient(data) {
    let next;
    if (data.id) {
      next = clients.map((c) => (c.id === data.id ? { ...c, ...data } : c));
      setSelectedClient({ ...selectedClient, ...data });
      setScreen('detail');
    } else {
      const newClient = { ...data, id: generateId(), createdAt: new Date().toISOString() };
      next = [newClient, ...clients];
      setScreen('list');
    }
    await persistClients(next);
  }

  async function handleDeleteClient(id) {
    const next = clients.filter((c) => c.id !== id);
    await persistClients(next);
    setScreen('list');
  }

  async function handleSaveSettings(next) {
    setSettings(next);
    await saveSettings(next);
    setScreen('list');
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {screen === 'list' && (
        <ClientListScreen
          clients={clients}
          settings={settings}
          onSelectClient={handleSelectClient}
          onAddClient={handleAddClient}
          onOpenSettings={() => setScreen('settings')}
        />
      )}

      {screen === 'form' && (
        <ClientFormScreen
          existingClient={editingClient}
          settings={settings}
          onSave={handleSaveClient}
          onDelete={handleDeleteClient}
          onCancel={() => setScreen(editingClient ? 'detail' : 'list')}
        />
      )}

      {screen === 'detail' && selectedClient && (
        <ClientDetailScreen
          client={selectedClient}
          settings={settings}
          onEdit={handleEditClient}
          onBack={() => setScreen('list')}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          settings={settings}
          onSave={handleSaveSettings}
          onCancel={() => setScreen('list')}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
});
