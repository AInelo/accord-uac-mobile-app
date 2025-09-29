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

  const AgreementCard = ({ agreement }: { agreement: Agreement }) => (
    <TouchableOpacity
      style={styles.agreementCard}
      onPress={() => router.push(`/agreement/${agreement.id}` as any)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {agreement.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(agreement.status) }]}>
          <Text style={styles.statusText}>
            {getStatusIcon(agreement.status)} {agreement.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardRow}>
          <MapPin size={16} color={Colors.gray.dark} />
          <Text style={styles.cardInfo}>
            {agreement.country} • {agreement.startDate.split('-')[0]}-{agreement.endDate.split('-')[0]}
          </Text>
        </View>
        
        <View style={styles.cardRow}>
          <FileText size={16} color={Colors.gray.dark} />
          <Text style={styles.cardInfo}>{agreement.domain}</Text>
        </View>
        
        <View style={styles.cardRow}>
          <Calendar size={16} color={Colors.gray.dark} />
          <Text style={styles.cardInfo}>
            Signé le {new Date(agreement.signatureDate).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.partnersText}>
          Partenaires: {agreement.partners.join(', ')}
        </Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Voir détails</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.gray.dark} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un accord..."
            placeholderTextColor={Colors.gray.dark}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
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
          {filteredAgreements.length} accord{filteredAgreements.length > 1 ? 's' : ''} trouvé{filteredAgreements.length > 1 ? 's' : ''}
        </Text>
      </View>

      {/* Agreements List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.accent]}
            tintColor={Colors.accent}
          />
        }
      >
        {filteredAgreements.length > 0 ? (
          <View style={styles.agreementsList}>
            {filteredAgreements.map((agreement) => (
              <AgreementCard key={agreement.id} agreement={agreement} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <FileText size={64} color={Colors.gray.medium} />
            <Text style={styles.emptyTitle}>Aucun accord trouvé</Text>
            <Text style={styles.emptyText}>
              Essayez de modifier vos critères de recherche ou vos filtres.
            </Text>
          </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.gray.dark,
    fontWeight: '500' as const,
  },
  scrollView: {
    flex: 1,
  },
  agreementsList: {
    padding: 16,
    gap: 16,
  },
  agreementCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    elevation: 3,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 4,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.primary,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold' as const,
  },
  cardContent: {
    gap: 8,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardInfo: {
    fontSize: 14,
    color: Colors.gray.dark,
    flex: 1,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
    paddingTop: 12,
    gap: 12,
  },
  partnersText: {
    fontSize: 13,
    color: Colors.gray.dark,
    fontStyle: 'italic' as const,
  },
  detailsButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  detailsButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray.dark,
    textAlign: 'center',
    lineHeight: 24,
  },
});