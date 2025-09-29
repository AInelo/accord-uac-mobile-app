import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import {
  Menu,
  Search,
  User,
  FileText,
  Globe,
  BarChart3,

  BookOpen,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUAC } from '@/contexts/UACContext';

export default function HomeScreen() {
  const { statistics } = useUAC();
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [drawerAnimation] = useState(new Animated.Value(-280));

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
    onPress 
  }: { 
    icon: any; 
    title: string; 
    value: number; 
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
      <View style={styles.statIconContainer}>
        <Icon size={24} color={Colors.accent} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <Menu size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UAC ACCORDS</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={20} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <User size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>🎓 PORTAL UAC</Text>
          <Text style={styles.welcomeSubtitle}>Accords de Coopération</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.gray.dark} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un accord"
            placeholderTextColor={Colors.gray.dark}
            onFocus={() => router.push('/agreements')}
          />
        </View>

        {/* Visits Counter */}
        <View style={styles.visitsContainer}>
          <BarChart3 size={20} color={Colors.accent} />
          <Text style={styles.visitsText}>
            📊 {statistics.totalVisits.toLocaleString()} visites
          </Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={FileText}
            title="Accords en cours"
            value={statistics.activeAgreements}
            onPress={() => router.push('/agreements')}
          />
          <StatCard
            icon={Globe}
            title="Partenaires actifs"
            value={statistics.activePartners}
            onPress={() => router.push('/map')}
          />
          <StatCard
            icon={BookOpen}
            title="Documents récents"
            value={statistics.recentDocuments}
            onPress={() => router.push('/agreements')}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/agreements')}
            >
              <FileText size={20} color={Colors.white} />
              <Text style={styles.actionButtonText}>Tous les accords</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/map')}
            >
              <Globe size={20} color={Colors.white} />
              <Text style={styles.actionButtonText}>Carte mondiale</Text>
            </TouchableOpacity>
          </View>
        </View>
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
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.drawerTitle}>Menu Principal</Text>
        </View>
        
        <View style={styles.drawerContent}>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/')}
          >
            <Text style={styles.drawerItemText}>🏠 Accueil</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/agreements')}
          >
            <Text style={styles.drawerItemText}>📋 Tous les accords</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/agreements')}
          >
            <Text style={styles.drawerItemText}>⏳ Accords en cours</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/agreements')}
          >
            <Text style={styles.drawerItemText}>🔄 Reconduction tacite</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/agreements')}
          >
            <Text style={styles.drawerItemText}>❌ Accords expirés</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/map')}
          >
            <Text style={styles.drawerItemText}>🌍 Carte des partenaires</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.drawerItem}
            onPress={() => navigateToScreen('/agreements')}
          >
            <Text style={styles.drawerItemText}>📊 Statistiques</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Text style={styles.drawerItemText}>⚙️ Paramètres</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Text style={styles.drawerItemText}>🚪 Connexion</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
    paddingVertical: 12,
    elevation: 4,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 4,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold' as const,
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.primary,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.gray.dark,
    marginTop: 8,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    elevation: 2,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Colors.shadow.opacity,
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
  visitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    gap: 8,
  },
  visitsText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  statsGrid: {
    gap: 16,
    marginVertical: 16,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    elevation: 3,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 4,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.gray.dark,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.primary,
  },
  quickActions: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.primary,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
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
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 20,
  },
  closeButton: {
    marginRight: 16,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold' as const,
  },
  drawerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold' as const,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
  },
  drawerItemText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
});