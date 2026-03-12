'use client';

import { useEffect, useRef } from 'react';
import { Forecast } from '@/types';
import { getAQIInfo } from '@/lib/utils';

interface ForecastChartProps {
  forecasts: Forecast[];
  title?: string;
}

export default function ForecastChart({ forecasts, title = '24-Hour AQI Forecast' }: ForecastChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<unknown>(null);

  useEffect(() => {
    if (!canvasRef.current || forecasts.length === 0) return;

    const loadChart = async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy();
      }

      const labels = forecasts.map(f => {
        const date = new Date(f.forecastTime);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });

      const aqiValues = forecasts.map(f => f.predictedAqi);
      const backgroundColors = aqiValues.map(aqi => getAQIInfo(aqi).color + '80');
      const borderColors = aqiValues.map(aqi => getAQIInfo(aqi).color);

      chartRef.current = new Chart(canvasRef.current!, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Predicted AQI',
              data: aqiValues,
              backgroundColor: backgroundColors,
              borderColor: '#3b82f6',
              borderWidth: 2,
              fill: false,
              tension: 0.4,
              pointBackgroundColor: borderColors,
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true },
            tooltip: {
              callbacks: {
                afterLabel: (ctx) => {
                  const aqi = ctx.raw as number;
                  return `Status: ${getAQIInfo(aqi).label}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 300,
              title: { display: true, text: 'AQI' },
            },
            x: {
              ticks: { maxTicksLimit: 12 },
            },
          },
        },
      });
    };

    loadChart();

    return () => {
      if (chartRef.current) {
        (chartRef.current as { destroy: () => void }).destroy();
      }
    };
  }, [forecasts]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-64">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
