'use client';

import { useEffect, useRef } from 'react';
import { SensorStation, AirQualityData } from '@/types';
import { getAQIInfo } from '@/lib/utils';

interface InteractiveMapProps {
  stations: SensorStation[];
  aqiData: AirQualityData[];
  height?: string;
}

export default function InteractiveMap({ stations, aqiData, height = '500px' }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      // @ts-expect-error - Leaflet CSS must be imported dynamically but lacks TypeScript definitions for dynamic CSS imports
      await import('leaflet/dist/leaflet.css');

      // Fix default icon
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!).setView([40.7589, -73.9851], 11);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      stations.forEach((station) => {
        const stationData = aqiData.find(d => d.stationId === station.id);
        const aqi = stationData?.aqi || 0;
        const aqiInfo = getAQIInfo(aqi);

        const marker = L.circleMarker([station.latitude, station.longitude], {
          radius: 14,
          fillColor: aqiInfo.color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        }).addTo(map);

        const popupContent = `
          <div style="min-width: 180px;">
            <h3 style="font-weight: bold; margin-bottom: 6px;">${station.name}</h3>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="background: ${aqiInfo.color}; color: white; padding: 2px 8px; border-radius: 9999px; font-weight: bold;">
                AQI ${aqi}
              </span>
              <span style="font-size: 12px; color: #666;">${aqiInfo.label}</span>
            </div>
            ${stationData ? `
              <div style="font-size: 12px; color: #555;">
                <div>PM2.5: ${Number(stationData.pm25).toFixed(1)} μg/m³</div>
                <div>PM10: ${Number(stationData.pm10).toFixed(1)} μg/m³</div>
                <div>NO₂: ${Number(stationData.no2).toFixed(1)} ppb</div>
              </div>
            ` : ''}
            <div style="font-size: 11px; color: #888; margin-top: 4px;">Type: ${station.type || 'fixed'}</div>
          </div>
        `;

        marker.bindPopup(popupContent);
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stations, aqiData]);

  return <div ref={mapRef} style={{ height, width: '100%', borderRadius: '0.75rem' }} />;
}
