'use client';

import { useState, useEffect } from 'react';
import AQIDisplay from '@/components/AQIDisplay';
import HealthAlerts from '@/components/HealthAlerts';
import { AirQualityData, HealthAlert } from '@/types';

export default function DashboardPage() {
  const [sensorData, setSensorData] = useState<AirQualityData[]>([]);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedStation, setSelectedStation] = useState<number>(0);

  const fetchData = async () => {
    try {
      const [sensorsRes, alertsRes] = await Promise.all([
        fetch('/api/sensors/current'),
        fetch('/api/health/alerts'),
      ]);
      const sensorsJson = await sensorsRes.json();
      const alertsJson = await alertsRes.json();
      setSensorData(sensorsJson.data || []);
      setAlerts(alertsJson.alerts || []);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const averageAQI = sensorData.length > 0
    ? Math.round(sensorData.reduce((sum, d) => sum + d.aqi, 0) / sensorData.length)
    : 0;

  const activeAlerts = alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading air quality data...</p>
        </div>
      </div>
    );
  }

  const displayData = selectedStation === 0
    ? sensorData
    : sensorData.filter(d => d.stationId === selectedStation);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Air Quality Dashboard</h1>
          <p className="text-gray-500 text-sm">Real-time monitoring across {sensorData.length} stations</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Last updated</p>
          <p className="text-sm font-medium text-gray-600">{lastUpdated}</p>
          <button
            onClick={fetchData}
            className="mt-1 text-xs text-blue-600 hover:text-blue-700"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Average AQI', value: averageAQI, icon: '🌬️', sub: 'City-wide average' },
          { label: 'Active Stations', value: sensorData.filter(d => d.stationId).length, icon: '📡', sub: 'Online sensors' },
          { label: 'Active Alerts', value: activeAlerts, icon: '⚠️', sub: 'High/Critical alerts' },
          { label: 'Good Stations', value: sensorData.filter(d => d.aqi <= 50).length, icon: '✅', sub: 'AQI ≤ 50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-xs text-gray-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AQI Cards */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Station Readings</h2>
            <select
              value={selectedStation}
              onChange={e => setSelectedStation(Number(e.target.value))}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>All Stations</option>
              {sensorData.map(d => (
                <option key={d.stationId} value={d.stationId}>
                  {d.station?.name || `Station ${d.stationId}`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayData.map((data) => (
              <AQIDisplay key={data.stationId} data={data} showDetails={true} />
            ))}
          </div>
        </div>

        {/* Health Alerts sidebar */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Health Alerts</h2>
          <HealthAlerts alerts={alerts} />

          <div className="mt-6 bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">🌱 Sustainability Tips</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Use public transport to reduce emissions</li>
              <li>• Plant trees and support green initiatives</li>
              <li>• Report pollution sources in your area</li>
              <li>• Share air quality data with neighbors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
