import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/colors';
import { useUAC } from '@/contexts/UACContext';

const { width, height } = Dimensions.get('window');

export default function StatisticsScreen() {
  const { agreements, partners, statistics } = useUAC();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Calculer les données pour les graphiques
  const agreementTypesData = agreements.reduce((acc, agreement) => {
    acc[agreement.type] = (acc[agreement.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const agreementStatusData = agreements.reduce((acc, agreement) => {
    acc[agreement.status] = (acc[agreement.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const domainData = agreements.reduce((acc, agreement) => {
    acc[agreement.domain] = (acc[agreement.domain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Données pour le graphique circulaire des types d'accords
  const pieChartData = Object.entries(agreementTypesData).map(([type, count], index) => ({
    name: type,
    population: count,
    color: getColorByIndex(index),
    legendFontColor: Colors.primary,
    legendFontSize: 12,
  }));

  // Données pour le graphique circulaire des statuts
  const statusPieChartData = Object.entries(agreementStatusData).map(([status, count], index) => ({
    name: status,
    population: count,
    color: getStatusColor(status),
    legendFontColor: Colors.primary,
    legendFontSize: 12,
  }));

  // Données pour le graphique en barres des domaines
  const barChartData = {
    labels: Object.keys(domainData).slice(0, 6), // Limiter à 6 domaines
    datasets: [{
      data: Object.values(domainData).slice(0, 6),
      color: (opacity = 1) => `rgba(139, 69, 19, ${opacity})`, // Couleur accent
    }],
  };

  function getColorByIndex(index: number): string {
    const colors = [
      '#8B4513', // Brun
      '#228B22', // Vert
      '#FF8C00', // Orange
      '#DC143C', // Rouge
      '#4169E1', // Bleu
      '#9370DB', // Violet
    ];
    return colors[index % colors.length];
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'En cours':
        return '#228B22'; // Vert
      case 'Expiré':
        return '#DC143C'; // Rouge
      case 'Reconduction tacite':
        return '#FF8C00'; // Orange
      default:
        return '#8B4513'; // Brun
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    subtitle,
    icon,
    color = Colors.primary 
  }: { 
    title: string; 
    value: string | number; 
    subtitle?: string;
    icon: string;
    color?: string;
  }) => (
    <View style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <Ionicons name={icon as any} size={24} color={color} />
        <Text style={styles.statCardTitle}>{title}</Text>
      </View>
      <Text style={[styles.statCardValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statCardSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Statistiques</Text>
          <Text style={styles.headerSubtitle}>Analyses détaillées</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="download" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          {/* Statistiques générales */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Accords"
                value={agreements.length}
                subtitle="Tous types confondus"
                icon="document-text"
                color={Colors.primary}
              />
              <StatCard
                title="Partenaires"
                value={partners.length}
                subtitle="Pays différents"
                icon="globe"
                color={Colors.accent}
              />
              <StatCard
                title="Accords Actifs"
                value={agreementStatusData['En cours'] || 0}
                subtitle="En cours d'exécution"
                icon="checkmark-circle"
                color={Colors.success}
              />
              <StatCard
                title="Taux de Renouvellement"
                value={`${Math.round(((agreementStatusData['Reconduction tacite'] || 0) / agreements.length) * 100)}%`}
                subtitle="Reconductions automatiques"
                icon="refresh"
                color={Colors.warning}
              />
            </View>
          </View>

          {/* Graphique circulaire - Types d'accords */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distribution par Type</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
                width={width - 40}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(139, 69, 19, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 10]}
                absolute
              />
            </View>
          </View>

          {/* Graphique circulaire - Statuts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distribution par Statut</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={statusPieChartData}
                width={width - 40}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(139, 69, 19, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 10]}
                absolute
              />
            </View>
          </View>

          {/* Graphique en barres - Domaines */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Répartition par Domaine</Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={barChartData}
                width={width - 40}
                height={220}
                chartConfig={{
                  backgroundColor: Colors.white,
                  backgroundGradientFrom: Colors.white,
                  backgroundGradientTo: Colors.white,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(139, 69, 19, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(13, 7, 2, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: Colors.accent,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                showValuesOnTopOfBars
              />
            </View>
          </View>

          {/* Top pays partenaires */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Pays Partenaires</Text>
            <View style={styles.countryList}>
              {partners
                .sort((a, b) => b.agreementsCount - a.agreementsCount)
                .slice(0, 5)
                .map((partner, index) => (
                  <View key={partner.id} style={styles.countryItem}>
                    <View style={styles.countryRank}>
                      <Text style={styles.countryRankText}>#{index + 1}</Text>
                    </View>
                    <Text style={styles.countryFlag}>{partner.flag}</Text>
                    <View style={styles.countryInfo}>
                      <Text style={styles.countryName}>{partner.country}</Text>
                      <Text style={styles.countryAgreements}>
                        {partner.agreementsCount} accord{partner.agreementsCount > 1 ? 's' : ''}
                      </Text>
                    </View>
                    <View style={styles.countryBar}>
                      <View 
                        style={[
                          styles.countryBarFill, 
                          { 
                            width: `${(partner.agreementsCount / Math.max(...partners.map(p => p.agreementsCount))) * 100}%` 
                          }
                        ]} 
                      />
                    </View>
                  </View>
                ))}
            </View>
          </View>

          {/* Évolution temporelle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Évolution Temporelle</Text>
            <View style={styles.timelineContainer}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineYear}>2024</Text>
                  <Text style={styles.timelineDescription}>
                    {agreements.filter(a => a.startDate.startsWith('2024')).length} nouveaux accords
                  </Text>
                </View>
              </View>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineYear}>2023</Text>
                  <Text style={styles.timelineDescription}>
                    {agreements.filter(a => a.startDate.startsWith('2023')).length} nouveaux accords
                  </Text>
                </View>
              </View>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineYear}>2022</Text>
                  <Text style={styles.timelineDescription}>
                    {agreements.filter(a => a.startDate.startsWith('2022')).length} nouveaux accords
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    elevation: 8,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: Colors.white,
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 44) / 2,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.gray.light,
    elevation: 2,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 8,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statCardSubtitle: {
    fontSize: 12,
    color: Colors.gray.dark,
  },
  chartContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.gray.light,
    elevation: 2,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  countryList: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.gray.light,
    elevation: 2,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  countryRank: {
    width: 30,
    alignItems: 'center',
  },
  countryRankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  countryAgreements: {
    fontSize: 12,
    color: Colors.gray.dark,
  },
  countryBar: {
    width: 60,
    height: 8,
    backgroundColor: Colors.gray.light,
    borderRadius: 4,
    marginLeft: 8,
  },
  countryBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  timelineContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.gray.light,
    elevation: 2,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  timelineYear: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  timelineDescription: {
    fontSize: 14,
    color: Colors.gray.dark,
    marginTop: 2,
  },
}); 