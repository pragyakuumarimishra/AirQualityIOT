import { AirQualityData, Forecast, HealthAlert, CommunityPost, SensorStation } from '@/types';

// Mock sensor stations
export const mockSensorStations: SensorStation[] = [
  { id: 1, name: 'Central Park Station', latitude: 40.7851, longitude: -73.9683, status: 'active', type: 'fixed' },
  { id: 2, name: 'Times Square Monitor', latitude: 40.7580, longitude: -73.9855, status: 'active', type: 'fixed' },
  { id: 3, name: 'Brooklyn Bridge Sensor', latitude: 40.7061, longitude: -73.9969, status: 'active', type: 'fixed' },
  { id: 4, name: 'Harlem Air Quality Hub', latitude: 40.8116, longitude: -73.9465, status: 'active', type: 'fixed' },
  { id: 5, name: 'Queens Monitor Station', latitude: 40.7282, longitude: -73.7949, status: 'active', type: 'mobile' },
  { id: 6, name: 'Bronx Environmental Node', latitude: 40.8448, longitude: -73.8648, status: 'active', type: 'citizen' },
  { id: 7, name: 'Staten Island Sensor', latitude: 40.5795, longitude: -74.1502, status: 'maintenance', type: 'fixed' },
  { id: 8, name: 'Downtown Manhattan Hub', latitude: 40.7128, longitude: -74.0060, status: 'active', type: 'fixed' },
];

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateMockAQIData(stationId: number): AirQualityData {
  const baseAqi = randomBetween(20, 180);
  return {
    id: Math.floor(Math.random() * 10000),
    stationId,
    timestamp: new Date().toISOString(),
    pm25: randomBetween(5, 75),
    pm10: randomBetween(10, 150),
    no2: randomBetween(10, 100),
    o3: randomBetween(20, 120),
    co: randomBetween(0.1, 9),
    so2: randomBetween(0.5, 30),
    aqi: Math.round(baseAqi),
    station: mockSensorStations.find(s => s.id === stationId),
  };
}

export function generateHistoricalData(stationId: number, days: number = 7): AirQualityData[] {
  const data: AirQualityData[] = [];
  const now = new Date();

  for (let d = days - 1; d >= 0; d--) {
    for (let h = 0; h < 24; h += 3) {
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - d);
      timestamp.setHours(h, 0, 0, 0);

      const baseAqi = randomBetween(30, 160);
      data.push({
        id: Math.floor(Math.random() * 100000),
        stationId,
        timestamp: timestamp.toISOString(),
        pm25: randomBetween(5, 75),
        pm10: randomBetween(10, 150),
        no2: randomBetween(10, 100),
        o3: randomBetween(20, 120),
        co: randomBetween(0.1, 9),
        so2: randomBetween(0.5, 30),
        aqi: Math.round(baseAqi),
      });
    }
  }
  return data;
}

export function generateForecastData(stationId: number): Forecast[] {
  const forecasts: Forecast[] = [];
  const now = new Date();

  for (let h = 1; h <= 24; h++) {
    const forecastTime = new Date(now);
    forecastTime.setHours(forecastTime.getHours() + h);

    forecasts.push({
      id: h,
      stationId,
      forecastTime: forecastTime.toISOString(),
      predictedAqi: Math.round(randomBetween(40, 150)),
      confidence: randomBetween(70, 95),
    });
  }
  return forecasts;
}

export const mockHealthAlerts: HealthAlert[] = [
  {
    id: 1,
    title: 'High PM2.5 Levels Detected',
    message: 'Fine particulate matter levels have exceeded safe thresholds in downtown area.',
    severity: 'high',
    aqi: 165,
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 2,
    title: 'Ozone Alert',
    message: 'Ground-level ozone concentrations are elevated. Sensitive groups should limit outdoor activities.',
    severity: 'medium',
    aqi: 120,
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 3,
    title: 'Air Quality Improving',
    message: 'Air quality in the northern district has improved to moderate levels.',
    severity: 'low',
    aqi: 85,
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 1,
    userId: 1,
    username: 'eco_warrior_nyc',
    content: 'Noticed heavy smog near the industrial zone today. Submitted a report through the app!',
    location: 'Queens, NY',
    aqi: 145,
    likes: 12,
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: 2,
    userId: 2,
    username: 'clean_air_advocate',
    content: 'The new sensor in Central Park is showing great readings today. Love this initiative!',
    location: 'Manhattan, NY',
    aqi: 42,
    likes: 28,
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 3,
    userId: 3,
    username: 'citizen_scientist_42',
    content: 'Just installed a low-cost sensor on my balcony. Contributing real-time data to the network!',
    location: 'Brooklyn, NY',
    aqi: 67,
    likes: 45,
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
];
