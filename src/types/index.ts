export interface SensorStation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'inactive' | 'maintenance';
  type?: string;
}

export interface AirQualityData {
  id: number;
  stationId: number;
  timestamp: string;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  aqi: number;
  station?: SensorStation;
}

export interface Forecast {
  id: number;
  stationId: number;
  forecastTime: string;
  predictedAqi: number;
  confidence: number;
}

export interface HealthAlert {
  id: number;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  aqi: number;
  timestamp: string;
}

export interface CommunityPost {
  id: number;
  userId: number;
  username: string;
  content: string;
  location?: string;
  aqi?: number;
  likes: number;
  timestamp: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  points: number;
  badges: string[];
  createdAt: string;
}

export type AQILevel = 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';

export interface AQIInfo {
  level: AQILevel;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
  healthTip: string;
}
