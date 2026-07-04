import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { formatAmount } from '../utils/message';

export default function ClientFormScreen({ existingClient, settings, onSave, onDelete, onCancel }) {
  const [name, setName] = useState(existingClient?.name ?? '');
  const [phone, setPhone] = useState(existingClient?.phone ?? '');
  const [email, setEmail] = useState(existingClient?.email ?? '');
  const [dealAmount, setDealAmount] = useState(
    existingClient ? String(existingClient.dealAmount) : ''
  );
  const [collectedPayment, setCollectedPayment] = useState(
    existingClient ? String(existingClient.collectedPayment) : ''
  );

  const deal = Number(dealAmount) || 0;
  const collected = Number(collectedPayment) || 0;
  const remaining = Math.max(deal - collected, 0);

  function handleSave() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter the client / customer name.');
      return;
    }
    if (!dealAmount || isNaN(deal)) {
      Alert.alert('Deal amount required', 'Please enter a valid deal amount.');
      return;
    }
    if (collectedPayment && isNaN(collected)) {
      Alert.alert('Invalid amount', 'Collected payment must be a number.');
      return;
    }

    onSave({
      id: existingClient?.id,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      dealAmount: deal,
      collectedPayment: collected,
      remainingPayment: remaining,
    });
  }

  function handleDelete() {
    Alert.alert('Delete client', `Remove ${existingClient.name}? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(existingClient.id) },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.header}>{existingClient ? 'Edit Client' : 'New Client'}</Text>

          <Text style={styles.label}>Client / Customer Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Ramesh Traders"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>WhatsApp Number (with country code)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. 919876543210"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="e.g. client@example.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.sectionTitle}>Payment Details</Text>

          <Text style={styles.label}>Deal Amount</Text>
          <TextInput
            style={styles.input}
            value={dealAmount}
            onChangeText={setDealAmount}
            placeholder="Total deal value"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Collected Payment</Text>
          <TextInput
            style={styles.input}
            value={collectedPayment}
            onChangeText={setCollectedPayment}
            placeholder="Amount received so far"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Remaining Payment (auto-calculated)</Text>
          <View style={styles.readOnlyBox}>
            <Text style={styles.readOnlyText}>
              {formatAmount(remaining, settings.currencySymbol)}
            </Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Client</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          {existingClient && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Delete Client</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 20, paddingBottom: 60 },
  header: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 16 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginTop: 12,
    marginBottom: 4,
  },
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
  readOnlyBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  readOnlyText: { fontSize: 16, fontWeight: '700', color: '#DC2626' },
  saveButton: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelButton: { paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  cancelButtonText: { color: '#6B7280', fontSize: 15, fontWeight: '600' },
  deleteButton: { paddingVertical: 14, alignItems: 'center', marginTop: 6 },
  deleteButtonText: { color: '#DC2626', fontSize: 15, fontWeight: '600' },
});
