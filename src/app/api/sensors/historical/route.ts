import { NextResponse } from 'next/server';
import { generateHistoricalData } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = parseInt(searchParams.get('stationId') || '1');
    const days = parseInt(searchParams.get('days') || '7');

    const data = generateHistoricalData(stationId, days);
    return NextResponse.json({ data, stationId, days });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 });
  }
}
