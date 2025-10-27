import { NextResponse } from 'next/server';

/**
 * Weather tool - demonstrates tool integration with AI SDK
 * Usage: AI can call this to get weather information
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  
  if (!location) {
    return NextResponse.json(
      { error: 'Location is required' },
      { status: 400 }
    );
  }

  // In production, replace with actual weather API
  const mockWeather = {
    location,
    temperature: Math.floor(Math.random() * 20) + 15,
    condition: ['Sunny', 'Cloudy', 'Rainy', 'Windy'][Math.floor(Math.random() * 4)],
    humidity: Math.floor(Math.random() * 40) + 50,
    windSpeed: Math.floor(Math.random() * 10) + 5,
  };

  return NextResponse.json(mockWeather);
}

