import { NextResponse } from 'next/server';
import { generateForecastData } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = parseInt(searchParams.get('stationId') || '1');

    const forecasts = generateForecastData(stationId);
    return NextResponse.json({ forecasts, stationId });
  } catch {
    return NextResponse.json({ error: 'Failed to generate forecast' }, { status: 500 });
  }
}
