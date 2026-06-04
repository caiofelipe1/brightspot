// ─── Environment / Gadget ───────────────────────────────────────────────
export type RiskLevel = 'safe' | 'attention' | 'critical' | 'unknown';

export type OperationMode = 'exploration' | 'economy' | 'blackbox' | 'alert';

export interface SensorReading {
  temperature: number;   // °C
  humidity: number;      // %
  luminosity: number;    // lux
  airQuality: number;    // 0–500 AQI
  vibration: number;     // 0–10 scale
}

export interface EnvironmentLog {
  id: string;
  name: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  mode: OperationMode;
  sensors: SensorReading;
  riskLevel: RiskLevel;
  aiRecommendation: string;
  batteryLevel: number;  // %
  hasConnection: boolean;
  isFavorite: boolean;
}

export interface Gadget {
  id: string;
  name: string;
  serialNumber: string;
  batteryLevel: number;
  isConnected: boolean;
  currentMode: OperationMode;
  lastSeen: string;
  logs: EnvironmentLog[];
}

// ─── NASA API ────────────────────────────────────────────────────────────
export interface NasaApod {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  date: string;
  media_type: string;
  copyright?: string;
}

export interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  rover: {
    name: string;
    status: string;
  };
  camera: {
    full_name: string;
  };
}

export interface NasaMarsResponse {
  photos: MarsPhoto[];
}

// ─── Weather API ─────────────────────────────────────────────────────────
export interface WeatherData {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: { description: string; icon: string; main: string }[];
  wind: { speed: number };
  visibility: number;
}

// ─── Navigation ──────────────────────────────────────────────────────────
export type RootTabParamList = {
  Home: undefined;
  Environments: undefined;
  Favorites: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  EnvironmentDetail: { log: EnvironmentLog };
  NasaGallery: undefined;
};

export type EnvironmentsStackParamList = {
  EnvironmentsList: undefined;
  EnvironmentDetail: { log: EnvironmentLog };
};
