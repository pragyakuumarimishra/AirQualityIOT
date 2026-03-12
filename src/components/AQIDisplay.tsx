'use client';

import { AirQualityData } from '@/types';
import { getAQIInfo } from '@/lib/utils';

interface AQIDisplayProps {
  data: AirQualityData;
  showDetails?: boolean;
}

export default function AQIDisplay({ data, showDetails = true }: AQIDisplayProps) {
  const aqiInfo = getAQIInfo(data.aqi);

  return (
    <div className={`rounded-xl p-6 ${aqiInfo.bgColor} border border-opacity-30`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{data.station?.name || `Station ${data.stationId}`}</h3>
          <p className={`text-sm font-medium ${aqiInfo.textColor}`}>{aqiInfo.label}</p>
        </div>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
          style={{ backgroundColor: aqiInfo.color }}
        >
          {data.aqi}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{aqiInfo.description}</p>

      {showDetails && (
        <>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'PM2.5', value: data.pm25, unit: 'μg/m³' },
              { label: 'PM10', value: data.pm10, unit: 'μg/m³' },
              { label: 'NO₂', value: data.no2, unit: 'ppb' },
              { label: 'O₃', value: data.o3, unit: 'ppb' },
              { label: 'CO', value: data.co, unit: 'ppm' },
              { label: 'SO₂', value: data.so2, unit: 'ppb' },
            ].map((metric) => (
              <div key={metric.label} className="bg-white bg-opacity-70 rounded-lg p-2 text-center">
                <p className="text-xs font-semibold text-gray-500">{metric.label}</p>
                <p className="text-sm font-bold text-gray-800">{Number(metric.value).toFixed(1)}</p>
                <p className="text-xs text-gray-400">{metric.unit}</p>
              </div>
            ))}
          </div>

          <div className="bg-white bg-opacity-70 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-500 mb-1">💡 Health Tip</p>
            <p className="text-sm text-gray-700">{aqiInfo.healthTip}</p>
          </div>
        </>
      )}
    </div>
  );
}
