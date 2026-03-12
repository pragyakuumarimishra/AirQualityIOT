'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Forecast, AirQualityData } from '@/types';
import { mockSensorStations, generateForecastData, generateHistoricalData } from '@/lib/api';
import { getAQIInfo } from '@/lib/utils';

const ForecastChart = dynamic(() => import('@/components/ForecastChart'), { ssr: false });

export default function ForecastPage() {
  const [selectedStation, setSelectedStation] = useState(1);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [historical, setHistorical] = useState<AirQualityData[]>([]);

  useEffect(() => {
    const fc = generateForecastData(selectedStation);
    setForecasts(fc);
    const hist = generateHistoricalData(selectedStation, 7);
    setHistorical(hist);
  }, [selectedStation]);

  // Group historical by day for daily summary
  const dailySummary = (() => {
    const days: Record<string, number[]> = {};
    historical.forEach(d => {
      const day = new Date(d.timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (!days[day]) days[day] = [];
      days[day].push(d.aqi);
    });
    return Object.entries(days).map(([day, values]) => ({
      day,
      avgAqi: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    }));
  })();

  const nextHourForecast = forecasts[0];
  const next24Avg = forecasts.length > 0
    ? Math.round(forecasts.reduce((s, f) => s + f.predictedAqi, 0) / forecasts.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Air Quality Forecast</h1>
          <p className="text-gray-500 text-sm">24-hour predictions with trend analysis</p>
        </div>
        <select
          value={selectedStation}
          onChange={e => setSelectedStation(Number(e.target.value))}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {mockSensorStations.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Summary cards */}
      {nextHourForecast && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-1">Next Hour</p>
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-2"
              style={{ backgroundColor: getAQIInfo(nextHourForecast.predictedAqi).color }}
            >
              {nextHourForecast.predictedAqi}
            </div>
            <p className={`text-sm font-medium ${getAQIInfo(nextHourForecast.predictedAqi).textColor}`}>
              {getAQIInfo(nextHourForecast.predictedAqi).label}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {nextHourForecast.confidence.toFixed(0)}% confidence
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-1">24h Average</p>
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-2"
              style={{ backgroundColor: getAQIInfo(next24Avg).color }}
            >
              {next24Avg}
            </div>
            <p className={`text-sm font-medium ${getAQIInfo(next24Avg).textColor}`}>
              {getAQIInfo(next24Avg).label}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-blue-800 mb-2">🤖 AI Analysis</p>
            <p className="text-xs text-blue-700">
              Based on current patterns and meteorological data, air quality is expected to remain{' '}
              <strong>{getAQIInfo(next24Avg).label.toLowerCase()}</strong> over the next 24 hours.
            </p>
            <p className="text-xs text-blue-600 mt-2">
              {getAQIInfo(next24Avg).healthTip}
            </p>
          </div>
        </div>
      )}

      {/* Forecast chart */}
      <div className="mb-8">
        <ForecastChart forecasts={forecasts} title={`24-Hour Forecast - ${mockSensorStations.find(s => s.id === selectedStation)?.name}`} />
      </div>

      {/* Historical 7-day summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">7-Day Historical Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {dailySummary.map(({ day, avgAqi }) => {
            const info = getAQIInfo(avgAqi);
            return (
              <div key={day} className={`${info.bgColor} rounded-lg p-3 text-center`}>
                <p className="text-xs text-gray-500 mb-1">{day.split(',')[0]}</p>
                <p className="text-lg font-bold" style={{ color: info.color }}>{avgAqi}</p>
                <p className={`text-xs font-medium ${info.textColor}`}>{info.label.split(' ')[0]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
