import axios from 'axios';
import { WeatherData } from '../types';

// Chave gratuita em openweathermap.org/api
const API_KEY = '9b34ca7bf7edc308bb0314215e150668';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherApi = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});

export async function fetchWeatherByCoords(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const response = await weatherApi.get<WeatherData>('/weather', {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'pt_br',
    },
  });
  return response.data;
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const response = await weatherApi.get<WeatherData>('/weather', {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric',
      lang: 'pt_br',
    },
  });
  return response.data;
}

// Mock para quando não houver API key
export function getMockWeather(): WeatherData {
  return {
    name: 'São Paulo',
    sys: { country: 'BR' },
    main: {
      temp: 22,
      feels_like: 21,
      humidity: 68,
      pressure: 1013,
    },
    weather: [{ description: 'parcialmente nublado', icon: '02d', main: 'Clouds' }],
    wind: { speed: 3.5 },
    visibility: 10000,
  };
}
