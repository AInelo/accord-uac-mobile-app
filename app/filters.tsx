import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Calendar, RotateCcw, Check } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useUAC } from '@/contexts/UACContext';
import { agreementTypes, domains, countries } from '@/constants/mockData';

export default function FiltersScreen() {
  const { selectedFilters, updateFilter, clearFilters, searchQuery, setSearchQuery } = useUAC();
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const applyFilters = () => {
    setSearchQuery(localSearchQuery);
    router.back();
  };

  const resetFilters = () => {
    clearFilters();
    setLocalSearchQuery('');
    setStartDate('');
    setEndDate('');
  };

  const FilterSection = ({ 
    title, 
    items, 
    selectedItems, 
    onToggle 
  }: { 
    title: string; 
    items: string[] | { name: string; code: string; flag: string }[]; 
    selectedItems: string[]; 
    onToggle: (item: string) => void;
  }) => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
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
    </View>
  );

  const statusOptions = ['En cours', 'Expiré', 'Reconduction tacite'];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>🔍 Recherche</Text>
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
          <Text style={styles.sectionTitle}>📅 Période</Text>
          <View style={styles.dateInputs}>
            <View style={styles.dateInputContainer}>
              <Calendar size={16} color={Colors.gray.dark} />
              <TextInput
                style={styles.dateInput}
                placeholder="Date de début"
                placeholderTextColor={Colors.gray.dark}
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View style={styles.dateInputContainer}>
              <Calendar size={16} color={Colors.gray.dark} />
              <TextInput
                style={styles.dateInput}
                placeholder="Date de fin"
                placeholderTextColor={Colors.gray.dark}
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
          </View>
        </View>

        {/* Agreement Type Filter */}
        <FilterSection
          title="🏷️ Type d'accord"
          items={agreementTypes}
          selectedItems={selectedFilters.types}
          onToggle={(item) => updateFilter('types', item)}
        />

        {/* Domain Filter */}
        <FilterSection
          title="🎓 Domaine"
          items={domains}
          selectedItems={selectedFilters.domains}
          onToggle={(item) => updateFilter('domains', item)}
        />

        {/* Status Filter */}
        <FilterSection
          title="📊 État"
          items={statusOptions}
          selectedItems={selectedFilters.status}
          onToggle={(item) => updateFilter('status', item)}
        />

        {/* Country Filter */}
        <FilterSection
          title="🌍 Pays"
          items={countries}
          selectedItems={selectedFilters.countries}
          onToggle={(item) => updateFilter('countries', item)}
        />

        {/* Active Filters Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>📋 Filtres actifs</Text>
          <View style={styles.activeFilers}>
            {localSearchQuery && (
              <View style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>Recherche: "{localSearchQuery}"</Text>
              </View>
            )}
            {selectedFilters.types.map((type) => (
              <View key={type} style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>Type: {type}</Text>
              </View>
            ))}
            {selectedFilters.domains.map((domain) => (
              <View key={domain} style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>Domaine: {domain}</Text>
              </View>
            ))}
            {selectedFilters.status.map((status) => (
              <View key={status} style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>État: {status}</Text>
              </View>
            ))}
            {selectedFilters.countries.map((country) => (
              <View key={country} style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>Pays: {country}</Text>
              </View>
            ))}
          </View>
          {(localSearchQuery || 
            selectedFilters.types.length > 0 || 
            selectedFilters.domains.length > 0 || 
            selectedFilters.status.length > 0 || 
            selectedFilters.countries.length > 0) ? null : (
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
  searchSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.primary,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 12,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.primary,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterOptions: {
    gap: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray.light,
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
    fontWeight: '500' as const,
  },
  filterOptionTextSelected: {
    color: Colors.white,
  },
  summarySection: {
    marginBottom: 24,
  },
  activeFilers: {
    gap: 8,
  },
  activeFilter: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  activeFilterText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  noFiltersText: {
    fontSize: 14,
    color: Colors.gray.dark,
    fontStyle: 'italic' as const,
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
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  resetButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600' as const,
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
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});