'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SensorStation, AirQualityData } from '@/types';
import { mockSensorStations, generateMockAQIData } from '@/lib/api';
import { getAQIInfo } from '@/lib/utils';

const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [stations] = useState<SensorStation[]>(mockSensorStations);
  const [aqiData, setAqiData] = useState<AirQualityData[]>([]);

  useEffect(() => {
    const data = mockSensorStations.map(s => generateMockAQIData(s.id));
    setAqiData(data);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Interactive Air Quality Map</h1>
        <p className="text-gray-500 text-sm">Real-time sensor locations and air quality heatmap</p>
      </div>

      {/* AQI Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: 'Good (0-50)', color: '#00E400' },
          { label: 'Moderate (51-100)', color: '#FFFF00' },
          { label: 'Sensitive (101-150)', color: '#FF7E00' },
          { label: 'Unhealthy (151-200)', color: '#FF0000' },
          { label: 'Very Unhealthy (201-300)', color: '#8F3F97' },
          { label: 'Hazardous (301+)', color: '#7E0023' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1 shadow-sm text-xs">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <InteractiveMap stations={stations} aqiData={aqiData} height="500px" />
      </div>

      {/* Station list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stations.map(station => {
          const data = aqiData.find(d => d.stationId === station.id);
          const aqiInfo = data ? getAQIInfo(data.aqi) : getAQIInfo(0);
          return (
            <div key={station.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{station.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{station.type} · {station.status}</p>
                </div>
                {data && (
                  <span
                    className="text-white text-sm font-bold px-2 py-1 rounded-full"
                    style={{ backgroundColor: aqiInfo.color }}
                  >
                    {data.aqi}
                  </span>
                )}
              </div>
              {data && (
                <p className={`text-xs font-medium ${aqiInfo.textColor}`}>{aqiInfo.label}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
