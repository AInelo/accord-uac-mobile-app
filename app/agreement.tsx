import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Filter, FileText, Calendar, MapPin } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUAC } from '@/contexts/UACContext';
import { Agreement } from '@/constants/types';

export default function AgreementsScreen() {
  const { filteredAgreements, searchQuery, setSearchQuery } = useUAC();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: Agreement['status']) => {
    switch (status) {
      case 'En cours':
        return Colors.success;
      case 'Expiré':
        return Colors.error;
      case 'Reconduction tacite':
        return Colors.warning;
      default:
        return Colors.gray.dark;
    }
  };

  const getStatusIcon = (status: Agreement['status']) => {
    switch (status) {
      case 'En cours':
        return '✅';
      case 'Expiré':
        return '❌';
      case 'Reconduction tacite':
        return '🔄';
      default:
        return '📄';
    }
  };

  const AgreementCard = ({ agreement }: { agreement: Agreement }) => {
    return (
      <TouchableOpacity
        style={styles.agreementCard}
        onPress={() => router.push(`/agreement/${agreement.id}` as any)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.countryInfo}>
            <Text style={styles.flagEmoji}>{agreement.flag}</Text>
            <Text style={styles.countryName}>{agreement.country}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(agreement.status) }]}>
            <Text style={styles.statusText}>{agreement.status}</Text>
          </View>
        </View>
        
        <Text style={styles.agreementTitle}>{agreement.title}</Text>
        
        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <FileText size={16} color={Colors.gray.dark} />
            <Text style={styles.detailText}>{agreement.type}</Text>
          </View>
          <View style={styles.detailItem}>
            <MapPin size={16} color={Colors.gray.dark} />
            <Text style={styles.detailText}>{agreement.domain}</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.dateInfo}>
            <Calendar size={14} color={Colors.gray.medium} />
            <Text style={styles.dateText}>
              {agreement.startDate} - {agreement.endDate}
            </Text>
          </View>
          <Text style={styles.partnersCount}>
            {agreement.partners.length} partenaire(s)
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.gray.dark} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un accord..."
          placeholderTextColor={Colors.gray.dark}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => router.push('/filters' as any)}
        >
          <Filter size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredAgreements.length} accord(s) trouvé(s)
        </Text>
      </View>

      {/* Agreements List */}
      <ScrollView
        style={styles.agreementsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {filteredAgreements.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={64} color={Colors.gray.medium} />
            <Text style={styles.emptyTitle}>Aucun accord trouvé</Text>
            <Text style={styles.emptyText}>
              Essayez de modifier vos critères de recherche
            </Text>
          </View>
        ) : (
          filteredAgreements.map((agreement) => (
            <AgreementCard key={agreement.id} agreement={agreement} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 2.5,
    borderColor: Colors.gray.light,
    elevation: 2,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.primary,
  },
  filterButton: {
    backgroundColor: Colors.accent,
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.gray.dark,
    fontWeight: '500',
  },
  agreementsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  agreementCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2.5,
    borderColor: Colors.gray.light,
    elevation: 2,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  countryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  agreementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
    lineHeight: 24,
  },
  cardDetails: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: Colors.gray.dark,
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: Colors.gray.medium,
    marginLeft: 6,
  },
  partnersCount: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.gray.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray.medium,
    textAlign: 'center',
    lineHeight: 20,
  },
});
