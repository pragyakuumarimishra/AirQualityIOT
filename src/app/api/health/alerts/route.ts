import { NextResponse } from 'next/server';
import { mockHealthAlerts } from '@/lib/api';

export async function GET() {
  try {
    return NextResponse.json({ alerts: mockHealthAlerts });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch health alerts' }, { status: 500 });
  }
}
