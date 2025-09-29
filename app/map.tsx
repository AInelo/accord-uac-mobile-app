import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { router } from 'expo-router';
import { MapPin, BarChart3, Filter, Search, X, Users, FileText } from 'lucide-react-native';
import * as Location from 'expo-location';
import { Colors } from '@/constants/colors';
import { useUAC } from '@/contexts/UACContext';
import { Agreement, Partner } from '@/constants/types';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const { partners, agreements, filteredAgreements } = useUAC();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const mapRef = useRef<MapView>(null);

  const regions = [
    { name: 'Europe', countries: ['France', 'Allemagne', 'Italie', 'Espagne', 'Royaume-Uni'] },
    { name: 'Amérique', countries: ['États-Unis', 'Canada', 'Brésil'] },
    { name: 'Asie', countries: ['Japon', 'Chine', 'Inde'] },
    { name: 'Afrique', countries: ['Afrique du Sud'] },
  ];

  // Demander la permission de localisation
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'La localisation est nécessaire pour afficher votre position sur la carte.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

  const getRegionStats = (regionName: string) => {
    const regionCountries = regions.find(r => r.name === regionName)?.countries || [];
    const regionPartners = partners.filter(p => regionCountries.includes(p.country));
    const totalAgreements = regionPartners.reduce((sum, p) => sum + p.agreementsCount, 0);
    return { partners: regionPartners.length, agreements: totalAgreements };
  };

  const getAgreementsByCountry = (countryCode: string) => {
    return agreements.filter(agreement => agreement.countryCode === countryCode);
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

  const getMarkerColor = (agreementsCount: number) => {
    if (agreementsCount >= 4) return '#e74c3c'; // Rouge pour beaucoup d'accords
    if (agreementsCount >= 2) return '#f39c12'; // Orange pour quelques accords
    return '#27ae60'; // Vert pour peu d'accords
  };

  const centerMapOnPartners = () => {
    if (partners.length === 0) return;
    
    const coordinates = partners.map(partner => ({
      latitude: partner.latitude,
      longitude: partner.longitude,
    }));

    if (mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const centerMapOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      Alert.alert('Localisation indisponible', 'Impossible d\'obtenir votre position actuelle.');
    }
  };

  const PartnerMarker = ({ partner }: { partner: Partner }) => {
    const countryAgreements = getAgreementsByCountry(partner.countryCode);
    
    return (
      <Marker
        key={partner.id}
        coordinate={{
          latitude: partner.latitude,
          longitude: partner.longitude,
        }}
        title={partner.country}
        description={`${partner.agreementsCount} accord(s) de coopération`}
        pinColor={getMarkerColor(partner.agreementsCount)}
        onPress={() => setSelectedPartner(partner)}
      >
        <Callout style={styles.callout}>
          <View style={styles.calloutContainer}>
            <View style={styles.calloutHeader}>
              <Text style={styles.flagEmoji}>{partner.flag}</Text>
              <Text style={styles.calloutTitle}>{partner.country}</Text>
            </View>
            <Text style={styles.calloutSubtitle}>
              {partner.agreementsCount} accord(s) actif(s)
            </Text>
            <TouchableOpacity
              style={styles.calloutButton}
              onPress={() => {
                setSelectedPartner(partner);
              }}
            >
              <Text style={styles.calloutButtonText}>Voir les détails</Text>
            </TouchableOpacity>
          </View>
        </Callout>
      </Marker>
    );
  };

  const PartnerDetailsModal = () => (
    <Modal
      visible={selectedPartner !== null}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <View style={styles.modalHeaderContent}>
            <Text style={styles.modalFlagEmoji}>{selectedPartner?.flag}</Text>
            <Text style={styles.modalTitle}>
              {selectedPartner?.country}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPartner(null)}
          >
            <X size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalStats}>
            <View style={styles.modalStat}>
              <FileText size={20} color={Colors.primary} />
              <Text style={styles.modalStatText}>
                {selectedPartner?.agreementsCount} accord(s)
              </Text>
            </View>
          </View>

          <Text style={styles.agreementsTitle}>Accords de coopération :</Text>
          {selectedPartner && getAgreementsByCountry(selectedPartner.countryCode).map((agreement) => (
            <View key={agreement.id} style={styles.agreementCard}>
              <View style={styles.agreementHeader}>
                <Text style={styles.agreementTitle}>{agreement.title}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(agreement.status) }
                ]}>
                  <Text style={styles.statusText}>{agreement.status}</Text>
                </View>
              </View>
              <Text style={styles.agreementType}>{agreement.type}</Text>
              <Text style={styles.agreementDomain}>Domaine: {agreement.domain}</Text>
              <Text style={styles.agreementDates}>
                {agreement.startDate} - {agreement.endDate}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  // Fallback pour le web
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapTitle}>🌍 Carte Mondiale</Text>
            <Text style={styles.mapSubtitle}>Partenaires UAC</Text>
            
            {/* Partner Pins pour le web */}
            {partners.map((partner) => (
              <TouchableOpacity
                key={partner.id}
                style={[
                  styles.partnerPin,
                  { 
                    left: Math.random() * (width - 100) + 50,
                    top: Math.random() * (height * 0.4) + 100,
                  }
                ]}
                onPress={() => setSelectedPartner(partner)}
              >
                <View style={styles.pinContainer}>
                  <Text style={styles.flagEmoji}>{partner.flag}</Text>
                  <View style={[styles.countBadge, { backgroundColor: getMarkerColor(partner.agreementsCount) }]}>
                    <Text style={styles.countText}>{partner.agreementsCount}</Text>
                  </View>
                </View>
                <Text style={styles.countryName}>{partner.country}</Text>
              </TouchableOpacity>
            ))}
            
            {/* Légende */}
            <View style={styles.legend}>
              <Text style={styles.legendTitle}>Légende</Text>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#e74c3c' }]} />
                <Text style={styles.legendText}>4+ accords</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#f39c12' }]} />
                <Text style={styles.legendText}>2-3 accords</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#27ae60' }]} />
                <Text style={styles.legendText}>1 accord</Text>
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
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/filters' as any)}
          >
            <Filter size={20} color={Colors.white} />
            <Text style={styles.actionButtonText}>Filtres</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/agreement' as any)}
          >
            <Search size={20} color={Colors.white} />
            <Text style={styles.actionButtonText}>Rechercher</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/agreement' as any)}
          >
            <BarChart3 size={20} color={Colors.white} />
            <Text style={styles.actionButtonText}>Liste</Text>
          </TouchableOpacity>
        </View>

        <PartnerDetailsModal />
      </View>
    );
  }

  // Version native pour Android/iOS
  return (
    <View style={styles.container}>
      {/* Map Container */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 6.3716, // Bénin (UAC)
            longitude: 2.3544,
            latitudeDelta: 50,
            longitudeDelta: 50,
          }}
          mapType={mapType}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/* Marqueurs des partenaires */}
          {partners.map((partner) => (
            <PartnerMarker key={partner.id} partner={partner} />
          ))}
        </MapView>

        {/* Contrôles de la carte */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={centerMapOnPartners}
          >
            <MapPin size={20} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={centerMapOnUser}
          >
            <Users size={20} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setMapType(
              mapType === 'standard' ? 'satellite' : 
              mapType === 'satellite' ? 'hybrid' : 'standard'
            )}
          >
            <Text style={styles.mapTypeText}>
              {mapType === 'standard' ? 'S' : mapType === 'satellite' ? 'H' : 'N'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Légende */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Légende</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#e74c3c' }]} />
            <Text style={styles.legendText}>4+ accords</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#f39c12' }]} />
            <Text style={styles.legendText}>2-3 accords</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#27ae60' }]} />
            <Text style={styles.legendText}>1 accord</Text>
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
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/filters' as any)}
        >
          <Filter size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Filtres</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/agreement' as any)}
        >
          <Search size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Rechercher</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/agreement' as any)}
        >
          <BarChart3 size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Liste</Text>
        </TouchableOpacity>
      </View>

      <PartnerDetailsModal />
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
  map: {
    flex: 1,
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
    fontWeight: 'bold',
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
  flagEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  countBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
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
    fontWeight: 'bold',
  },
  countryName: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 8,
  },
  controlButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 4,
  },
  mapTypeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  callout: {
    width: 200,
    padding: 0,
  },
  calloutContainer: {
    padding: 12,
    alignItems: 'center',
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 8,
  },
  calloutSubtitle: {
    fontSize: 12,
    color: Colors.gray.dark,
    marginBottom: 8,
  },
  calloutButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  calloutButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  legend: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 12,
    elevation: 3,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 4,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: '500',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  statCountries: {
    fontSize: 12,
    color: Colors.gray.dark,
    fontStyle: 'italic',
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
    fontWeight: '600',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalFlagEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modalStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray.light,
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  modalStatText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  agreementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  agreementCard: {
    backgroundColor: Colors.gray.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  agreementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  agreementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  agreementType: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
    marginBottom: 4,
  },
  agreementDomain: {
    fontSize: 12,
    color: Colors.gray.dark,
    marginBottom: 4,
  },
  agreementDates: {
    fontSize: 12,
    color: Colors.gray.medium,
    fontStyle: 'italic',
  },
});
