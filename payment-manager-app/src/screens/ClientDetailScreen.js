import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as MailComposer from 'expo-mail-composer';
import { formatAmount, buildPaymentMessage, buildEmailSubject } from '../utils/message';

export default function ClientDetailScreen({ client, settings, onEdit, onBack }) {
  const [copied, setCopied] = useState(false);
  const message = buildPaymentMessage({ client, settings });

  async function handleCopy() {
    await Clipboard.setStringAsync(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleOpenWhatsApp() {
    if (!client.phone) {
      Alert.alert('No WhatsApp number', 'Add a WhatsApp number for this client first (Edit).');
      return;
    }
    const digits = client.phone.replace(/[^0-9]/g, '');
    const url = `whatsapp://send?phone=${digits}&text=${encodeURIComponent(message)}`;
    const webUrl = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
    try {
      const supported = await Linking.canOpenURL(url);
      await Linking.openURL(supported ? url : webUrl);
    } catch (e) {
      Alert.alert('Could not open WhatsApp', 'Please copy the message instead.');
    }
  }

  async function handleSendEmail() {
    if (!client.email) {
      Alert.alert('No email address', 'Add an email address for this client first (Edit).');
      return;
    }
    const available = await MailComposer.isAvailableAsync();
    if (!available) {
      Alert.alert('Mail not set up', 'No email account is configured on this device.');
      return;
    }
    await MailComposer.composeAsync({
      recipients: [client.email],
      subject: buildEmailSubject({ client, settings }),
      body: message,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <Text style={styles.name}>{client.name}</Text>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <StatRow label="Deal Amount" value={formatAmount(client.dealAmount, settings.currencySymbol)} />
          <StatRow
            label="Collected Payment"
            value={formatAmount(client.collectedPayment, settings.currencySymbol)}
          />
          <StatRow
            label="Remaining Payment"
            value={formatAmount(client.remainingPayment, settings.currencySymbol)}
            emphasis
          />
        </View>

        <Text style={styles.sectionTitle}>Official Message</Text>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleCopy}>
          <Text style={styles.primaryButtonText}>{copied ? 'Copied ✓' : 'Copy Message'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.whatsappButton} onPress={handleOpenWhatsApp}>
          <Text style={styles.whatsappButtonText}>Send via WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.emailButton} onPress={handleSendEmail}>
          <Text style={styles.emailButtonText}>Send via Email</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatRow({ label, value, emphasis }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, emphasis && styles.statValueEmphasis]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  content: { padding: 20, paddingBottom: 60 },
  back: { fontSize: 15, color: '#2563EB', fontWeight: '600', marginBottom: 12 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: { fontSize: 24, fontWeight: '700', color: '#1A1A2E' },
  editLink: { fontSize: 15, color: '#2563EB', fontWeight: '600' },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  statLabel: { fontSize: 14, color: '#6B7280' },
  statValue: { fontSize: 15, fontWeight: '600', color: '#111827' },
  statValueEmphasis: { color: '#DC2626', fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  messageBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: { fontSize: 14, lineHeight: 21, color: '#374151' },
  primaryButton: {
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  whatsappButton: {
    backgroundColor: '#25D366',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  whatsappButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  emailButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  emailButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
