import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { 
  Search, 
  Calendar, 
  RotateCcw, 
  Check, 
  X, 
  ChevronDown,
  Filter,
  Clock,
  Globe,
  FileText,
  Award
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUAC } from '@/contexts/UACContext';
import { agreementTypes, domains, countries } from '@/constants/mockData';

export default function FiltersScreen() {
  const { selectedFilters, updateFilter, clearFilters, searchQuery, setSearchQuery } = useUAC();
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    types: true,
    domains: true,
    status: true,
    countries: true,
  });

  const applyFilters = () => {
    setSearchQuery(localSearchQuery);
    router.back();
  };

  const resetFilters = () => {
    clearFilters();
    setLocalSearchQuery('');
    setStartDate(null);
    setEndDate(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('fr-FR');
  };

  const FilterSection = ({ 
    title, 
    items, 
    selectedItems, 
    onToggle,
    sectionKey,
    icon: Icon
  }: { 
    title: string; 
    items: string[] | { name: string; code: string; flag: string }[];
    selectedItems: string[]; 
    onToggle: (item: string) => void;
    sectionKey: string;
    icon: any;
  }) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <View style={styles.filterSection}>
        <TouchableOpacity 
          style={styles.sectionHeader}
          onPress={() => toggleSection(sectionKey)}
        >
          <View style={styles.sectionHeaderContent}>
            <Icon size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionCount}>({selectedItems.length})</Text>
          </View>
          <ChevronDown 
            size={20} 
            color={Colors.primary} 
            style={[styles.chevron, isExpanded && styles.chevronExpanded]}
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.filterOptions}>
            {items.map((item) => {
              const itemName = typeof item === 'string' ? item : item.name;
              const isSelected = selectedItems.includes(itemName);
              
              return (
                <TouchableOpacity
                  key={itemName}
                  style={[
                    styles.filterOption,
                    isSelected && styles.filterOptionSelected
                  ]}
                  onPress={() => onToggle(itemName)}
                >
                  <View style={styles.filterOptionContent}>
                    {typeof item !== 'string' && (
                      <Text style={styles.flagEmoji}>{item.flag}</Text>
                    )}
                    <Text style={[
                      styles.filterOptionText,
                      isSelected && styles.filterOptionTextSelected
                    ]}>
                      {itemName}
                    </Text>
                  </View>
                  {isSelected && (
                    <Check size={16} color={Colors.white} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const DatePickerModal = ({ 
    visible, 
    onClose, 
    date, 
    onDateChange, 
    title 
  }: {
    visible: boolean;
    onClose: () => void;
    date: Date | null;
    onDateChange: (date: Date) => void;
    title: string;
  }) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                onDateChange(selectedDate);
                onClose();
              }
            }}
            style={styles.datePicker}
          />
        </View>
      </View>
    </Modal>
  );

  const statusOptions = ['En cours', 'Expiré', 'Reconduction tacite'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <X size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filtres et Recherche</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.sectionHeader}>
            <Search size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Recherche</Text>
          </View>
          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.gray.dark} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher par titre, pays, domaine..."
              placeholderTextColor={Colors.gray.dark}
              value={localSearchQuery}
              onChangeText={setLocalSearchQuery}
            />
          </View>
        </View>

        {/* Date Range Section */}
        <View style={styles.dateSection}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Période</Text>
          </View>
          <View style={styles.dateInputs}>
            <TouchableOpacity 
              style={styles.dateInputContainer}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Calendar size={16} color={Colors.gray.dark} />
              <Text style={[
                styles.dateInput,
                !startDate && styles.dateInputPlaceholder
              ]}>
                {startDate ? formatDate(startDate) : 'Date de début'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dateInputContainer}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Calendar size={16} color={Colors.gray.dark} />
              <Text style={[
                styles.dateInput,
                !endDate && styles.dateInputPlaceholder
              ]}>
                {endDate ? formatDate(endDate) : 'Date de fin'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Agreement Type Filter */}
        <FilterSection
          title="Type d'accord"
          items={agreementTypes}
          selectedItems={selectedFilters.types}
          onToggle={(item) => updateFilter('types', item)}
          sectionKey="types"
          icon={FileText}
        />

        {/* Domain Filter */}
        <FilterSection
          title="Domaine"
          items={domains}
          selectedItems={selectedFilters.domains}
          onToggle={(item) => updateFilter('domains', item)}
          sectionKey="domains"
          icon={Award}
        />

        {/* Status Filter */}
        <FilterSection
          title="État"
          items={statusOptions}
          selectedItems={selectedFilters.status}
          onToggle={(item) => updateFilter('status', item)}
          sectionKey="status"
          icon={Clock}
        />

        {/* Country Filter */}
        <FilterSection
          title="Pays"
          items={countries}
          selectedItems={selectedFilters.countries}
          onToggle={(item) => updateFilter('countries', item)}
          sectionKey="countries"
          icon={Globe}
        />

        {/* Active Filters Summary */}
        <View style={styles.summarySection}>
          <View style={styles.sectionHeader}>
            <Filter size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Filtres actifs</Text>
          </View>
          <View style={styles.activeFilters}>
            {localSearchQuery && (
              <View style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>Recherche: "{localSearchQuery}"</Text>
                <TouchableOpacity onPress={() => setLocalSearchQuery('')}>
                  <X size={14} color={Colors.white} />
                </TouchableOpacity>
              </View>
            )}
            {startDate && (
              <View style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>Début: {formatDate(startDate)}</Text>
                <TouchableOpacity onPress={() => setStartDate(null)}>
                  <X size={14} color={Colors.white} />
                </TouchableOpacity>
              </View>
            )}
            {endDate && (
              <View style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>Fin: {formatDate(endDate)}</Text>
                <TouchableOpacity onPress={() => setEndDate(null)}>
                  <X size={14} color={Colors.white} />
                </TouchableOpacity>
              </View>
            )}
            {selectedFilters.types.map((type) => (
              <View key={type} style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>Type: {type}</Text>
                <TouchableOpacity onPress={() => updateFilter('types', type)}>
                  <X size={14} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ))}
            {selectedFilters.domains.map((domain) => (
              <View key={domain} style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>Domaine: {domain}</Text>
                <TouchableOpacity onPress={() => updateFilter('domains', domain)}>
                  <X size={14} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ))}
            {selectedFilters.status.map((status) => (
              <View key={status} style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>État: {status}</Text>
                <TouchableOpacity onPress={() => updateFilter('status', status)}>
                  <X size={14} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ))}
            {selectedFilters.countries.map((country) => (
              <View key={country} style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>Pays: {country}</Text>
                <TouchableOpacity onPress={() => updateFilter('countries', country)}>
                  <X size={14} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {(localSearchQuery || 
            selectedFilters.types.length > 0 || 
            selectedFilters.domains.length > 0 || 
            selectedFilters.status.length > 0 || 
            selectedFilters.countries.length > 0 ||
            startDate || endDate) ? null : (
            <Text style={styles.noFiltersText}>Aucun filtre actif</Text>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <RotateCcw size={20} color={Colors.primary} />
          <Text style={styles.resetButtonText}>Réinitialiser</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Check size={20} color={Colors.white} />
          <Text style={styles.applyButtonText}>Appliquer</Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      <DatePickerModal
        visible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        date={startDate}
        onDateChange={setStartDate}
        title="Date de début"
      />
      <DatePickerModal
        visible={showEndDatePicker}
        onClose={() => setShowEndDatePicker(false)}
        date={endDate}
        onDateChange={setEndDate}
        title="Date de fin"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    elevation: 4,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  searchSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: 8,
  },
  sectionCount: {
    fontSize: 14,
    color: Colors.gray.medium,
    marginLeft: 8,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
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
  dateSection: {
    marginBottom: 24,
  },
  dateInputs: {
    gap: 12,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
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
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 12,
  },
  dateInputPlaceholder: {
    color: Colors.gray.dark,
  },
  filterSection: {
    marginBottom: 24,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: Colors.gray.light,
    elevation: 2,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  filterOptions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray.light,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.gray.medium,
  },
  filterOptionSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagEmoji: {
    fontSize: 16,
  },
  filterOptionText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: Colors.white,
  },
  summarySection: {
    marginBottom: 24,
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
  activeFilters: {
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activeFilter: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeFilterText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  noFiltersText: {
    fontSize: 14,
    color: Colors.gray.dark,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray.light,
  },
  resetButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2.5,
    borderColor: Colors.primary,
    elevation: 2,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resetButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: Colors.shadow.color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  closeButton: {
    padding: 8,
  },
  datePicker: {
    width: '100%',
  },
});
