import { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { fetchWeatherByCoords, getMockWeather } from '../services/weatherService';

export function useWeather(lat?: number, lon?: number, refreshKey: number = 0) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    const load = async () => {
      try {
        if (lat !== undefined && lon !== undefined) {
          const data = await fetchWeatherByCoords(lat, lon);
          if (mounted) setWeather(data);
        } else {
          // Use mock when no coords provided
          if (mounted) setWeather(getMockWeather());
        }
      } catch {
        // Fallback to mock on error (no API key configured)
        if (mounted) setWeather(getMockWeather());
        if (mounted) setError('Usando dados de exemplo. Configure sua API key.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [lat, lon, refreshKey]);

  return { weather, isLoading, error };
}
