import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function SettingsScreen({ settings, onSave, onCancel }) {
  const [businessName, setBusinessName] = useState(settings.businessName);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Settings</Text>

        <Text style={styles.label}>Business Name</Text>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="e.g. Sharma Interiors"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Currency Symbol</Text>
        <TextInput
          style={styles.input}
          value={currencySymbol}
          onChangeText={setCurrencySymbol}
          placeholder="e.g. ₹, $, €"
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => onSave({ businessName: businessName.trim() || 'My Business', currencySymbol: currencySymbol || '₹' })}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 20 },
  back: { fontSize: 15, color: '#2563EB', fontWeight: '600', marginBottom: 12 },
  header: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 20 },
  label: { fontSize: 13, color: '#4B5563', marginTop: 14, marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
