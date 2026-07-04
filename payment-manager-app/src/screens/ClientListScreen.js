import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { formatAmount } from '../utils/message';

export default function ClientListScreen({ clients, settings, onSelectClient, onAddClient, onOpenSettings }) {
  const totalOutstanding = clients.reduce((sum, c) => sum + (Number(c.remainingPayment) || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{settings.businessName}</Text>
          <Text style={styles.subtitle}>
            Outstanding: {formatAmount(totalOutstanding, settings.currencySymbol)}
          </Text>
        </View>
        <TouchableOpacity onPress={onOpenSettings} style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>⚙</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No clients yet.</Text>
            <Text style={styles.emptySubtext}>Tap "+ Add Client" to record a deal.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onSelectClient(item)}>
            <View style={styles.cardRow}>
              <Text style={styles.cardName}>{item.name}</Text>
              <View
                style={[
                  styles.badge,
                  Number(item.remainingPayment) > 0 ? styles.badgeDue : styles.badgePaid,
                ]}
              >
                <Text style={styles.badgeText}>
                  {Number(item.remainingPayment) > 0 ? 'Due' : 'Paid'}
                </Text>
              </View>
            </View>
            <View style={styles.cardStats}>
              <Text style={styles.cardStat}>
                Deal: {formatAmount(item.dealAmount, settings.currencySymbol)}
              </Text>
              <Text style={styles.cardStat}>
                Collected: {formatAmount(item.collectedPayment, settings.currencySymbol)}
              </Text>
              <Text style={[styles.cardStat, styles.remaining]}>
                Remaining: {formatAmount(item.remainingPayment, settings.currencySymbol)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={onAddClient}>
        <Text style={styles.addButtonText}>+ Add Client</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonText: { fontSize: 18 },
  listContent: { padding: 16, paddingBottom: 100 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  emptySubtext: { fontSize: 13, color: '#9CA3AF', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontSize: 17, fontWeight: '700', color: '#1A1A2E' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeDue: { backgroundColor: '#FEE2E2' },
  badgePaid: { backgroundColor: '#DCFCE7' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#1F2937' },
  cardStats: { marginTop: 10, gap: 4 },
  cardStat: { fontSize: 13.5, color: '#4B5563' },
  remaining: { fontWeight: '700', color: '#DC2626' },
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
