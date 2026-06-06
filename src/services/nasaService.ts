import axios from 'axios';
import { NasaApod, NasaMarsResponse, MarsPhoto } from '../types';

const NASA_API_KEY = 'DEMO_KEY'; // substituir por chave real em nasa.gov/open/apis
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
      id: 102693,
      img_src: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_462135992EDR_F0470104FHAZ00323M_.JPG',
      earth_date: '2015-06-03',
      rover: { name: 'Curiosity', status: 'active' },
      camera: { full_name: 'Front Hazard Avoidance Camera' },
    },
    {
      id: 102694,
      img_src: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FRB_462135992EDR_F0470104FHAZ00323M_.JPG',
      earth_date: '2015-06-03',
      rover: { name: 'Curiosity', status: 'active' },
      camera: { full_name: 'Front Hazard Avoidance Camera' },
    },
    {
      id: 102695,
      img_src: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/rcam/RLB_462135992EDR_F0470104RHAZ00323M_.JPG',
      earth_date: '2015-06-03',
      rover: { name: 'Curiosity', status: 'active' },
      camera: { full_name: 'Rear Hazard Avoidance Camera' },
    },
    {
      id: 102696,
      img_src: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/ncam/NRB_462033642EDR_F0470000NCAM00273M_.JPG',
      earth_date: '2015-06-03',
      rover: { name: 'Curiosity', status: 'active' },
      camera: { full_name: 'Navigation Camera - Right' },
    },
    {
      id: 102697,
      img_src: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/ncam/NLB_462033642EDR_F0470000NCAM00273M_.JPG',
      earth_date: '2015-06-03',
      rover: { name: 'Curiosity', status: 'active' },
      camera: { full_name: 'Navigation Camera - Left' },
    },
    {
      id: 102698,
      img_src: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/mcam/1000MR0044631300400602E01_DXXX.jpg',
      earth_date: '2015-06-03',
      rover: { name: 'Curiosity', status: 'active' },
      camera: { full_name: 'Mast Camera - Right' },
    },
  ];
}
