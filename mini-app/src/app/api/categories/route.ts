import { NextResponse } from 'next/server';
import https from 'https';
import axios from 'axios';

const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:3001';

const backendApi = axios.create({
  baseURL: BACKEND_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const response = await backendApi.get('/api/categories', { params: Object.fromEntries(searchParams) });
    return NextResponse.json(response.data);
  } catch (error: any) {
    const message = error.message || 'Unknown error';
    console.error('Proxy error fetching categories:', message);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: message },
      { status: 500 }
    );
  }
}
