import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { MapPin, BarChart3, Filter, Search } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUAC } from '@/contexts/UACContext';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const { partners } = useUAC();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regions = [
    { name: 'Europe', countries: ['France', 'Allemagne'] },
    { name: 'Amérique', countries: ['États-Unis', 'Canada'] },
    { name: 'Asie', countries: ['Japon'] },
  ];

  const getRegionStats = (regionName: string) => {
    const regionCountries = regions.find(r => r.name === regionName)?.countries || [];
    const regionPartners = partners.filter(p => regionCountries.includes(p.country));
    const totalAgreements = regionPartners.reduce((sum, p) => sum + p.agreementsCount, 0);
    return { partners: regionPartners.length, agreements: totalAgreements };
  };

  const PartnerPin = ({ partner }: { partner: any }) => (
    <TouchableOpacity
      style={[
        styles.partnerPin,
        { 
          left: Math.random() * (width - 100) + 50,
          top: Math.random() * (height * 0.4) + 100,
        }
      ]}
      onPress={() => {
        // Show partner details
      }}
    >
      <View style={styles.pinContainer}>
        <Text style={styles.flagText}>{partner.flag}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{partner.agreementsCount}</Text>
        </View>
      </View>
      <Text style={styles.countryName}>{partner.country}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Map Container */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapTitle}>🌍 Carte Mondiale</Text>
          <Text style={styles.mapSubtitle}>Partenaires UAC</Text>
          
          {/* Partner Pins */}
          {partners.map((partner) => (
            <PartnerPin key={partner.id} partner={partner} />
          ))}
          
          {/* Map Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Légende</Text>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: Colors.success }]} />
              <Text style={styles.legendText}>Accords actifs</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: Colors.warning }]} />
              <Text style={styles.legendText}>En négociation</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>🔍 Filtrer par région</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedRegion === null && styles.filterButtonActive
              ]}
              onPress={() => setSelectedRegion(null)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedRegion === null && styles.filterButtonTextActive
              ]}>
                Toutes
              </Text>
            </TouchableOpacity>
            {regions.map((region) => (
              <TouchableOpacity
                key={region.name}
                style={[
                  styles.filterButton,
                  selectedRegion === region.name && styles.filterButtonActive
                ]}
                onPress={() => setSelectedRegion(region.name)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedRegion === region.name && styles.filterButtonTextActive
                ]}>
                  {region.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>📊 Statistiques par région</Text>
        <ScrollView style={styles.statsList}>
          {regions.map((region) => {
            const stats = getRegionStats(region.name);
            return (
              <View key={region.name} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statRegion}>{region.name}</Text>
                  <View style={styles.statBadges}>
                    <View style={styles.statBadge}>
                      <Text style={styles.statBadgeText}>{stats.partners} pays</Text>
                    </View>
                    <View style={styles.statBadge}>
                      <Text style={styles.statBadgeText}>{stats.agreements} accords</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.statCountries}>
                  {region.countries.join(', ')}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <MapPin size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Ma position</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Search size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Rechercher</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/agreements' as any)}
        >
          <BarChart3 size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Statistiques</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 4,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.white,
    marginBottom: 8,
  },
  mapSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  partnerPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 24,
    marginBottom: 4,
  },
  countBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold' as const,
  },
  countryName: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600' as const,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  legend: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 12,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: Colors.primary,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 10,
    color: Colors.primary,
  },
  filtersContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.primary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.gray.light,
    borderWidth: 1,
    borderColor: Colors.gray.medium,
  },
  filterButtonActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  statsContainer: {
    backgroundColor: Colors.white,
    maxHeight: 200,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.primary,
    padding: 16,
    paddingBottom: 8,
  },
  statsList: {
    paddingHorizontal: 16,
  },
  statCard: {
    backgroundColor: Colors.gray.light,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statRegion: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.primary,
  },
  statBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statBadgeText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: 'bold' as const,
  },
  statCountries: {
    fontSize: 12,
    color: Colors.gray.dark,
    fontStyle: 'italic' as const,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600' as const,
  },
});