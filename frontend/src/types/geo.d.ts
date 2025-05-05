/**
 * Interface for geolocation data returned from the API
 */
export interface GeoLocation {
  ip: string;
  country_code: string;
  country_name: string;
  region: string;
  city: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  org?: string;
  asn?: string;
  proxy?: boolean;
  hosting?: boolean;
  currency?: string;
  languages?: string;
  continent_code?: string;
}
