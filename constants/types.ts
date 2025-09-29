// UAC Portal Types
export interface Agreement {
  id: string;
  title: string;
  type: 'Accord cadre' | 'Convention' | 'Coopération';
  domain: string;
  country: string;
  countryCode: string;
  startDate: string;
  endDate: string;
  status: 'En cours' | 'Expiré' | 'Reconduction tacite';
  signatureDate: string;
  partners: string[];
  documents: Document[];
  description?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'xlsx';
  url: string;
  size: string;
}

export interface Partner {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  agreementsCount: number;
  flag: string;
}

export interface Statistics {
  totalVisits: number;
  activeAgreements: number;
  activePartners: number;
  recentDocuments: number;
}