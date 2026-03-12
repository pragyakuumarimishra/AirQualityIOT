import { NextResponse } from 'next/server';
import { mockSensorStations, generateMockAQIData } from '@/lib/api';

export async function GET() {
  try {
    const data = mockSensorStations.map(station => generateMockAQIData(station.id));
    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch sensor data' }, { status: 500 });
  }
}
