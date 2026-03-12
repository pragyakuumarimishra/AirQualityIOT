import { AQIInfo } from '@/types';

export function getAQIInfo(aqi: number): AQIInfo {
  if (aqi <= 50) {
    return {
      level: 'good',
      label: 'Good',
      color: '#00E400',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
      healthTip: 'Great day to be active outside!',
    };
  } else if (aqi <= 100) {
    return {
      level: 'moderate',
      label: 'Moderate',
      color: '#FFFF00',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      description: 'Air quality is acceptable. However, there may be a risk for some people.',
      healthTip: 'Unusually sensitive people should consider reducing prolonged outdoor exertion.',
    };
  } else if (aqi <= 150) {
    return {
      level: 'sensitive',
      label: 'Unhealthy for Sensitive Groups',
      color: '#FF7E00',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      description: 'Members of sensitive groups may experience health effects.',
      healthTip: 'People with respiratory or heart disease should limit prolonged outdoor exertion.',
    };
  } else if (aqi <= 200) {
    return {
      level: 'unhealthy',
      label: 'Unhealthy',
      color: '#FF0000',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      description: 'Some members of the general public may experience health effects.',
      healthTip: 'Everyone should limit prolonged outdoor exertion.',
    };
  } else if (aqi <= 300) {
    return {
      level: 'very-unhealthy',
      label: 'Very Unhealthy',
      color: '#8F3F97',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      description: 'Health alert: The risk of health effects is increased for everyone.',
      healthTip: 'Everyone should avoid all outdoor exertion.',
    };
  } else {
    return {
      level: 'hazardous',
      label: 'Hazardous',
      color: '#7E0023',
      bgColor: 'bg-red-200',
      textColor: 'text-red-900',
      description: 'Health warning of emergency conditions: everyone is more likely to be affected.',
      healthTip: 'Everyone should avoid all outdoor activity.',
    };
  }
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
