import { useState, useMemo, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { Agreement, Partner, Statistics } from '@/constants/types';
import { mockAgreements, mockPartners, mockStatistics } from '@/constants/mockData';

export const [UACContext, useUAC] = createContextHook(() => {
  const [agreements] = useState<Agreement[]>(mockAgreements);
  const [partners] = useState<Partner[]>(mockPartners);
  const [statistics] = useState<Statistics>(mockStatistics);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<{
    types: string[];
    domains: string[];
    countries: string[];
    status: string[];
  }>({
    types: [],
    domains: [],
    countries: [],
    status: [],
  });

  const filteredAgreements = useMemo(() => {
    return agreements.filter(agreement => {
      const matchesSearch = searchQuery === '' || 
        agreement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agreement.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agreement.domain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedFilters.types.length === 0 || 
        selectedFilters.types.includes(agreement.type);

      const matchesDomain = selectedFilters.domains.length === 0 || 
        selectedFilters.domains.includes(agreement.domain);

      const matchesCountry = selectedFilters.countries.length === 0 || 
        selectedFilters.countries.includes(agreement.country);

      const matchesStatus = selectedFilters.status.length === 0 || 
        selectedFilters.status.includes(agreement.status);

      return matchesSearch && matchesType && matchesDomain && matchesCountry && matchesStatus;
    });
  }, [agreements, searchQuery, selectedFilters]);

  const getAgreementById = useCallback((id: string) => {
    return agreements.find(agreement => agreement.id === id);
  }, [agreements]);

  const clearFilters = useCallback(() => {
    setSelectedFilters({
      types: [],
      domains: [],
      countries: [],
      status: [],
    });
    setSearchQuery('');
  }, []);

  const updateFilter = useCallback((filterType: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value],
    }));
  }, []);

  return useMemo(() => ({
    agreements,
    partners,
    statistics,
    searchQuery,
    setSearchQuery,
    selectedFilters,
    setSelectedFilters,
    filteredAgreements,
    getAgreementById,
    clearFilters,
    updateFilter,
  }), [agreements, partners, statistics, searchQuery, selectedFilters, filteredAgreements, getAgreementById, clearFilters, updateFilter]);
});