import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Users, 
  Download, 
  Share2,
  Clock,
  Building,
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUAC } from '@/contexts/UACContext';

export default function AgreementDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getAgreementById } = useUAC();
  
  const agreement = getAgreementById(id || '');

  if (!agreement) {
    return (
      <View style={styles.errorContainer}>
        <FileText size={64} color={Colors.gray.medium} />
        <Text style={styles.errorTitle}>Accord non trouvé</Text>
        <Text style={styles.errorText}>
          L'accord demandé n'existe pas ou a été supprimé.
        </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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

  const handleDownload = () => {
    Alert.alert(
      'Téléchargement',
      'Fonctionnalité de téléchargement non implémentée dans cette démo.',
      [{ text: 'OK' }]
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Partage',
      'Fonctionnalité de partage non implémentée dans cette démo.',
      [{ text: 'OK' }]
    );
  };

  const InfoCard = ({ 
    icon: Icon, 
    title, 
    children 
  }: { 
    icon: any; 
    title: string; 
    children: React.ReactNode;
  }) => (
    <View style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <Icon size={20} color={Colors.accent} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{agreement.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(agreement.status) }]}>
            <Text style={styles.statusText}>
              {getStatusIcon(agreement.status)} {agreement.status}
            </Text>
          </View>
        </View>

        {/* Basic Information */}
        <InfoCard icon={FileText} title="📊 Informations générales">
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>{agreement.type}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Domaine:</Text>
            <Text style={styles.infoValue}>{agreement.domain}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Durée:</Text>
            <Text style={styles.infoValue}>
              {new Date(agreement.startDate).getFullYear()}-{new Date(agreement.endDate).getFullYear()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>État:</Text>
            <Text style={[styles.infoValue, { color: getStatusColor(agreement.status) }]}>
              {agreement.status}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Signature:</Text>
            <Text style={styles.infoValue}>
              {new Date(agreement.signatureDate).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </InfoCard>

        {/* Location and Duration */}
        <InfoCard icon={MapPin} title="🌍 Localisation et durée">
          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <MapPin size={16} color={Colors.accent} />
              <Text style={styles.locationText}>{agreement.country}</Text>
            </View>
            <View style={styles.locationItem}>
              <Calendar size={16} color={Colors.accent} />
              <Text style={styles.locationText}>
                Du {new Date(agreement.startDate).toLocaleDateString('fr-FR')} 
                au {new Date(agreement.endDate).toLocaleDateString('fr-FR')}
              </Text>
            </View>
            <View style={styles.locationItem}>
              <Clock size={16} color={Colors.accent} />
              <Text style={styles.locationText}>
                Durée: {Math.ceil((new Date(agreement.endDate).getTime() - new Date(agreement.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} ans
              </Text>
            </View>
          </View>
        </InfoCard>

        {/* Partners */}
        <InfoCard icon={Users} title="🤝 Partenaires">
          <View style={styles.partnersContainer}>
            {agreement.partners.map((partner, index) => (
              <View key={index} style={styles.partnerItem}>
                <Building size={16} color={Colors.accent} />
                <Text style={styles.partnerText}>{partner}</Text>
              </View>
            ))}
          </View>
        </InfoCard>

        {/* Description */}
        {agreement.description && (
          <InfoCard icon={FileText} title="📝 Description">
            <Text style={styles.descriptionText}>{agreement.description}</Text>
          </InfoCard>
        )}

        {/* Documents */}
        <InfoCard icon={FileText} title="📎 Documents">
          <View style={styles.documentsContainer}>
            {agreement.documents.map((document) => (
              <TouchableOpacity key={document.id} style={styles.documentItem}>
                <View style={styles.documentIcon}>
                  <FileText size={20} color={Colors.accent} />
                </View>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentName}>{document.name}</Text>
                  <Text style={styles.documentSize}>{document.size}</Text>
                </View>
                <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                  <Download size={16} color={Colors.white} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </InfoCard>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
          <Download size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Télécharger</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 size={20} color={Colors.white} />
          <Text style={styles.actionButtonText}>Partager</Text>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.primary,
    marginBottom: 12,
    lineHeight: 32,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    elevation: 3,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Colors.shadow.opacity,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.primary,
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray.dark,
    fontWeight: '500' as const,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
    flex: 2,
    textAlign: 'right',
  },
  locationContainer: {
    gap: 12,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: Colors.primary,
    flex: 1,
  },
  partnersContainer: {
    gap: 12,
  },
  partnerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.gray.light,
    padding: 12,
    borderRadius: 12,
  },
  partnerText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.primary,
    lineHeight: 20,
  },
  documentsContainer: {
    gap: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray.light,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 2,
  },
  documentSize: {
    fontSize: 12,
    color: Colors.gray.dark,
  },
  downloadButton: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    padding: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.secondary,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.gray.dark,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});