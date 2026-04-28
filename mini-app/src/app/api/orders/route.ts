import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import axios from 'axios';

const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:3001';

const backendApi = axios.create({
  baseURL: BACKEND_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await backendApi.post('/api/orders', body);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Proxy error creating order:', message);
    return NextResponse.json(
      { error: 'Failed to create order', details: message },
      { status: 500 }
    );
  }
}
