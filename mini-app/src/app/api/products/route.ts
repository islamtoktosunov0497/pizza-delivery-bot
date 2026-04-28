import { NextResponse } from 'next/server';
import https from 'https';
import axios from 'axios';

const BACKEND_URL = process.env.API_BACKEND_URL || 'http://localhost:3001';

// Create axios instance that accepts self-signed certificates
const backendApi = axios.create({
  baseURL: BACKEND_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const response = await backendApi.get('/api/products', { params: Object.fromEntries(searchParams) });
    return NextResponse.json(response.data);
  } catch (error: any) {
    const message = error.message || 'Unknown error';
    console.error('Proxy error fetching products:', {
      message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    });
    return NextResponse.json(
      { error: 'Failed to fetch products', details: message },
      { status: 500 }
    );
  }
}
