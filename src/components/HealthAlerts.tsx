'use client';

import { HealthAlert } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

interface HealthAlertsProps {
  alerts: HealthAlert[];
}

const severityConfig = {
  low: { bg: 'bg-green-50', border: 'border-green-200', icon: '✅', text: 'text-green-800', badge: 'bg-green-100 text-green-700' },
  medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '⚠️', text: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-700' },
  high: { bg: 'bg-orange-50', border: 'border-orange-200', icon: '🔔', text: 'text-orange-800', badge: 'bg-orange-100 text-orange-700' },
  critical: { bg: 'bg-red-50', border: 'border-red-200', icon: '🚨', text: 'text-red-800', badge: 'bg-red-100 text-red-700' },
};

export default function HealthAlerts({ alerts }: HealthAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="text-green-700 font-medium">No active health alerts</p>
        <p className="text-green-600 text-sm">Air quality is within safe limits</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const config = severityConfig[alert.severity];
        return (
          <div
            key={alert.id}
            className={`${config.bg} border ${config.border} rounded-xl p-4`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{config.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className={`font-semibold ${config.text}`}>{alert.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badge}`}>
                    AQI {alert.aqi}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(alert.timestamp)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
