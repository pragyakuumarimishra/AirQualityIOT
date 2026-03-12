'use client';

import { useState, useEffect } from 'react';
import HealthAlerts from '@/components/HealthAlerts';
import { HealthAlert } from '@/types';
import { getAQIInfo } from '@/lib/utils';

const healthRecommendations = [
  {
    group: 'General Public',
    icon: '👥',
    tips: [
      'Check the AQI before outdoor activities',
      'Wear a mask when AQI is above 150',
      'Stay indoors during high pollution periods',
      'Keep windows closed when outdoor air is poor',
    ],
  },
  {
    group: 'Children',
    icon: '👶',
    tips: [
      'Limit outdoor play when AQI exceeds 100',
      'Use filtered air indoors during high pollution',
      'Ensure proper hydration and rest',
      'Consult pediatrician for asthma management',
    ],
  },
  {
    group: 'Elderly',
    icon: '👴',
    tips: [
      'Avoid strenuous outdoor activities',
      'Keep medications accessible',
      'Monitor health symptoms closely',
      'Use air purifiers indoors',
    ],
  },
  {
    group: 'Outdoor Workers',
    icon: '👷',
    tips: [
      'Use N95 masks in high-pollution conditions',
      'Take regular breaks in clean air areas',
      'Monitor AQI updates throughout the day',
      'Report concerns to employer and authorities',
    ],
  },
];

export default function HealthPage() {
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health/alerts')
      .then(r => r.json())
      .then(data => {
        setAlerts(data.alerts || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Health Alerts &amp; Recommendations</h1>
        <p className="text-gray-500 text-sm">Stay informed and protect your health</p>
      </div>

      {/* AQI Health Index */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">AQI Health Index</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[0, 75, 125, 175, 250, 350].map((aqi, idx) => {
            const info = getAQIInfo(aqi);
            const ranges = ['0-50', '51-100', '101-150', '151-200', '201-300', '301+'];
            return (
              <div key={aqi} className={`${info.bgColor} rounded-lg p-4 border border-opacity-30`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: info.color }} />
                  <span className={`font-semibold text-sm ${info.textColor}`}>{info.label}</span>
                  <span className="text-xs text-gray-400">({ranges[idx]})</span>
                </div>
                <p className="text-xs text-gray-600">{info.healthTip}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active alerts */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Alerts</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <HealthAlerts alerts={alerts} />
          )}
        </div>

        {/* Recommendations by group */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Health Recommendations</h2>
          <div className="space-y-4">
            {healthRecommendations.map(rec => (
              <div key={rec.group} className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <span>{rec.icon}</span>
                  <span>{rec.group}</span>
                </h3>
                <ul className="space-y-1.5">
                  {rec.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
