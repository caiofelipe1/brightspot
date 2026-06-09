import axios from 'axios';
import { NasaApod, NasaMarsResponse, MarsPhoto } from '../types';

const NASA_API_KEY = 'bIIHTSsW6157bTAP6XBt4lW8cJ9oDxe9xrIH8EOv';
const BASE_URL = 'https://api.nasa.gov';

const nasaApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

nasaApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('[NASA API]', error.message);
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

// ─── Mock fallbacks (usados quando a API não responde) ───────────────────
export function getMockApod(): NasaApod {
  return {
    title: 'Nebulosa de Órion — M42',
    explanation:
      'A Nebulosa de Órion é uma das regiões de formação estelar mais estudadas do universo. ' +
      'Localizada a cerca de 1.344 anos-luz da Terra, é visível a olho nu como a "estrela" central ' +
      'da espada de Órion. O Telescópio Espacial Hubble revelou centenas de estrelas jovens e ' +
      'discos protoplanetários em seu interior.',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/800px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg',
    date: new Date().toISOString().split('T')[0],
    media_type: 'image',
  };
}

export function getMockMarsPhotos(): MarsPhoto[] {
  return [
    {
      id: 1,
      img_src: 'https://images-assets.nasa.gov/image/PIA16239/PIA16239~thumb.jpg',
      earth_date: '2012-08-06',
      rover: { name: 'Curiosity', status: 'active' },
      camera: { full_name: 'Mast Camera' },
    },
    {
      id: 2,
      img_src: 'https://images-assets.nasa.gov/image/PIA17089/PIA17089~thumb.jpg',
      earth_date: '2013-09-19',
      rover: { name: 'Curiosity', status: 'active' },
      camera: { full_name: 'Navigation Camera' },
    },
    {
      id: 3,
      img_src: 'https://images-assets.nasa.gov/image/PIA19148/PIA19148~thumb.jpg',
      earth_date: '2015-02-03',
      rover: { name: 'Curiosity', status: 'active' },
      camera: { full_name: 'Mars Hand Lens Imager' },
    },
    {
      id: 4,
      img_src: 'https://images-assets.nasa.gov/image/PIA20844/PIA20844~thumb.jpg',
      earth_date: '2016-09-08',
      rover: { name: 'Curiosity', status: 'active' },
      camera: { full_name: 'Mast Camera' },
    },
    {
      id: 5,
      img_src: 'https://images-assets.nasa.gov/image/PIA21723/PIA21723~thumb.jpg',
      earth_date: '2017-10-25',
      rover: { name: 'Curiosity', status: 'active' },
      camera: { full_name: 'Mars Hand Lens Imager' },
    },
    {
      id: 6,
      img_src: 'https://images-assets.nasa.gov/image/PIA22228/PIA22228~thumb.jpg',
      earth_date: '2018-01-23',
      rover: { name: 'Curiosity', status: 'active' },
      camera: { full_name: 'Mast Camera' },
    },
  ];
}
