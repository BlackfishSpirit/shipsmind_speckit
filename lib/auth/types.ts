export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  businessName: string;
  businessStreet: string;
  businessCity: string;
  businessState: string;
  businessZip: string;
  businessUrl: string;
  businessProfileText?: string;
}

export interface SerpSettings {
  keywords: string;
  category: string;
  excludedCategory: string;
  locations: string;
  states: string;
  repeatSearches: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}