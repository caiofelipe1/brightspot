import axios from 'axios';
import { NasaApod, NasaMarsResponse, MarsPhoto } from '../types';

const NASA_API_KEY = 'DEMO_KEY'; // substituir por chave real em nasa.gov/open/apis
const BASE_URL = 'https://api.nasa.gov';

const nasaApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// ─── Interceptors ────────────────────────────────────────────────────────
nasaApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[NASA API Error]', error.message);
    return Promise.reject(error);
  }
);

// ─── Astronomy Picture of the Day ────────────────────────────────────────
export async function fetchApod(): Promise<NasaApod> {
  const response = await nasaApi.get<NasaApod>('/planetary/apod', {
    params: { api_key: NASA_API_KEY },
  });
  return response.data;
}

// ─── Mars Rover Photos ───────────────────────────────────────────────────
export async function fetchMarsPhotos(sol: number = 1000): Promise<MarsPhoto[]> {
  const response = await nasaApi.get<NasaMarsResponse>(
    '/mars-photos/api/v1/rovers/curiosity/photos',
    {
      params: {
        sol,
        api_key: NASA_API_KEY,
        page: 1,
      },
    }
  );
  return response.data.photos.slice(0, 20);
}

// ─── APOD list (last 7 days) ─────────────────────────────────────────────
export async function fetchApodList(count: number = 7): Promise<NasaApod[]> {
  const response = await nasaApi.get<NasaApod[]>('/planetary/apod', {
    params: {
      api_key: NASA_API_KEY,
      count,
    },
  });
  return response.data;
}
