import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.text();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching LiveTrail data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch LiveTrail data' },
      { status: 500 }
    );
  }
} 