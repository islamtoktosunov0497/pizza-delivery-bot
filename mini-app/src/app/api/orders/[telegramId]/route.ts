import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import axios from 'axios';

const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:3001';

const backendApi = axios.create({
  baseURL: BACKEND_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ telegramId: string }> }
) {
  try {
    const { telegramId } = await params;
    const { searchParams } = new URL(request.url);
    const response = await backendApi.get(`/api/orders/${telegramId}`, { params: Object.fromEntries(searchParams) });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Proxy error fetching orders:', message);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: message },
      { status: 500 }
    );
  }
}
