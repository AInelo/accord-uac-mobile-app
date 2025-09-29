import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons, AntDesign, Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useUAC } from '@/contexts/UACContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { statistics } = useUAC();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [drawerAnimation] = useState(new Animated.Value(-280));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleDrawer = () => {
    const toValue = drawerVisible ? -280 : 0;
    Animated.timing(drawerAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setDrawerVisible(!drawerVisible);
  };

  const navigateToScreen = (screen: string) => {
    toggleDrawer();
    router.push(screen as any);
  };

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle,
    onPress 
  }: { 
    icon: (props: { size: number; color: string }) => React.ReactElement; 
    title: string; 
    value: number; 
    subtitle?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.statIconContainer}>
        <Icon size={28} color={Colors.primary} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray.medium} style={styles.statArrow} />
    </TouchableOpacity>
  );

  const QuickActionCard = ({ 
    icon: Icon, 
    title, 
    description,
    onPress 
  }: { 
    icon: (props: { size: number; color: string }) => React.ReactElement; 
    title: string; 
    description: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.quickActionIcon}>
        <Icon size={24} color={Colors.primary} />
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>UAC ACCORDS</Text>
          <Text style={styles.headerSubtitle}>Portail de Coopération</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={20} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="person" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>🎓 Bienvenue</Text>
              <Text style={styles.heroSubtitle}>
                Gérez et explorez les accords de coopération de l'UAC
              </Text>
              <View style={styles.heroStats}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>{statistics.totalVisits.toLocaleString()}</Text>
                  <Text style={styles.heroStatLabel}>Visites</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>{statistics.activeAgreements}</Text>
                  <Text style={styles.heroStatLabel}>Accords actifs</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={Colors.gray.dark} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un accord, un partenaire..."
                placeholderTextColor={Colors.gray.dark}
                onFocus={() => router.push('/agreement')}
              />
              <TouchableOpacity style={styles.searchButton}>
                <Ionicons name="filter" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Statistics Cards Grid */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📊 Statistiques</Text>
            <View style={styles.statsGrid}>
              <StatCard
                icon={(props) => <Ionicons name="document-text" {...props} />}
                title="Accords en cours"
                value={statistics.activeAgreements}
                subtitle="Actifs"
                onPress={() => router.push('/agreement')}
              />
              <StatCard
                icon={(props) => <Ionicons name="globe" {...props} />}
                title="Partenaires"
                value={statistics.activePartners}
                subtitle="Pays"
                onPress={() => router.push('/map')}
              />
              <StatCard
                icon={(props) => <Ionicons name="book" {...props} />}
                title="Documents"
                value={statistics.recentDocuments}
                subtitle="Récents"
                onPress={() => router.push('/agreement')}
              />
              <StatCard
                icon={(props) => <Ionicons name="trending-up" {...props} />}
                title="Croissance"
                value={12}
                subtitle="% ce mois"
                onPress={() => router.push('/agreement')}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>⚡ Actions rapides</Text>
            <View style={styles.quickActionsGrid}>
              <QuickActionCard
                icon={(props) => <Ionicons name="document-text" {...props} />}
                title="Tous les accords"
                description="Consultez la liste complète"
                onPress={() => router.push('/agreement')}
              />
              <QuickActionCard
                icon={(props) => <Ionicons name="globe" {...props} />}
                title="Carte mondiale"
                description="Explorez géographiquement"
                onPress={() => router.push('/map')}
              />
              <QuickActionCard
                icon={(props) => <Ionicons name="bar-chart" {...props} />}
                title="Statistiques"
                description="Analyses détaillées"
                onPress={() => router.push('/agreement')}
              />
                            <QuickActionCard
                icon={(props) => <Ionicons name="bar-chart" {...props} />}
                title="Statistiques"
                description="Analyses détaillées"
                onPress={() => router.push('/statistics')}
              />
              <QuickActionCard
                icon={(props) => <Ionicons name="filter" {...props} />}
                title="Filtres"
                description="Recherche avancée"
                onPress={() => router.push('/filters')}
              />
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>🕒 Activité récente</Text>
            <View style={styles.activityCard}>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="trophy" size={20} color={Colors.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Nouvel accord signé</Text>
                  <Text style={styles.activityDescription}>Convention UAC-Université de Tokyo</Text>
                  <Text style={styles.activityTime}>Il y a 2 heures</Text>
                </View>
              </View>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="people" size={20} color={Colors.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Nouveau partenaire</Text>
                  <Text style={styles.activityDescription}>Université de Cambridge</Text>
                  <Text style={styles.activityTime}>Il y a 1 jour</Text>
                </View>
              </View>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="calendar" size={20} color={Colors.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Renouvellement</Text>
                  <Text style={styles.activityDescription}>Accord UAC-UNESCO</Text>
                  <Text style={styles.activityTime}>Il y a 3 jours</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Drawer Overlay */}
      {drawerVisible && (
        <TouchableOpacity 
          style={styles.overlay} 
          onPress={toggleDrawer}
          activeOpacity={1}
        />
      )}

      {/* Drawer */}
      <Animated.View 
        style={[
          styles.drawer,
          { transform: [{ translateX: drawerAnimation }] }
        ]}
      >
        <View style={styles.drawerHeader}>
          <TouchableOpacity onPress={toggleDrawer} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.drawerTitle}>Menu Principal</Text>
        </View>
        
        <ScrollView style={styles.drawerContent}>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/')}
          >
            <View style={styles.drawerItemIconContainer}>
              <Ionicons name="home" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.drawerItemText}>Accueil</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray.medium} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/agreement')}
          >
            <View style={styles.drawerItemIconContainer}>
              <Ionicons name="document-text" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.drawerItemText}>Tous les accords</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray.medium} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/agreement')}
          >
            <View style={styles.drawerItemIconContainer}>
              <Ionicons name="time" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.drawerItemText}>Accords en cours</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray.medium} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/agreement')}
          >
            <View style={styles.drawerItemIconContainer}>
              <Ionicons name="refresh" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.drawerItemText}>Reconduction tacite</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray.medium} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/agreement')}
          >
            <View style={styles.drawerItemIconContainer}>
              <Ionicons name="close-circle" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.drawerItemText}>Accords expirés</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray.medium} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/map')}
          >
            <View style={styles.drawerItemIconContainer}>
              <Ionicons name="globe" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.drawerItemText}>Carte des partenaires</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray.medium} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/statistics')}
          >
            
            <View style={styles.drawerItemIconContainer}>
              <Ionicons name="bar-chart" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.drawerItemText}>Statistiques</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray.medium} />
          </TouchableOpacity>


          
          <View style={styles.drawerDivider} />
          <TouchableOpacity style={styles.drawerItem}>
            <View style={styles.drawerItemIconContainer}>
              <Ionicons name="settings" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.drawerItemText}>Paramètres</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray.medium} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <View style={styles.drawerItemIconContainer}>
              <Ionicons name="log-in" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.drawerItemText}>Connexion</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.gray.medium} />
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ... existing code ...

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
  menuButton: {
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
  heroSection: {
    marginVertical: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: Colors.gray.light,
    elevation: 4,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heroContent: {
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.gray.dark,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray.light,
    borderRadius: 16,
    padding: 16,
  },
  heroStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  heroStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  heroStatLabel: {
    fontSize: 12,
    color: Colors.gray.dark,
    marginTop: 4,
  },
  heroStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.gray.medium,
    marginHorizontal: 16,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
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
  searchButton: {
    backgroundColor: Colors.accent,
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  statsSection: {
    marginBottom: 24,
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
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: Colors.gray.light,
    elevation: 2,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    marginBottom: 16,
  },
  statContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.gray.dark,
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: Colors.gray.medium,
  },
  statArrow: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 44) / 2,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: Colors.gray.light,
    elevation: 2,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    marginBottom: 12,
  },
  quickActionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    color: Colors.gray.dark,
    textAlign: 'center',
    lineHeight: 16,
  },
  activitySection: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: Colors.gray.light,
    padding: 20,
    elevation: 2,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: Colors.gray.dark,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.gray.medium,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: Colors.white,
    zIndex: 2,
    elevation: 16,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  drawerHeader: {
    backgroundColor: Colors.primary,
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 20,
  },
  closeButton: {
    marginRight: 16,
    padding: 4,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  drawerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  drawerItemIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  drawerItemText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
    flex: 1,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: Colors.gray.light,
    marginVertical: 8,
  },
});
