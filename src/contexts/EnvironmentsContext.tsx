import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnvironmentLog, RiskLevel, SensorReading } from '../types';

interface EnvironmentsContextData {
  logs: EnvironmentLog[];
  favorites: EnvironmentLog[];
  addLog: (log: EnvironmentLog) => void;
  toggleFavorite: (id: string) => void;
  removeLog: (id: string) => void;
  isLoading: boolean;
}

const EnvironmentsContext = createContext<EnvironmentsContextData>(
  {} as EnvironmentsContextData
);

const LOGS_KEY = '@brightspot:logs';

// ─── Risk classification helper ─────────────────────────────────────────
export function classifyRisk(sensors: SensorReading): RiskLevel {
  const { temperature, humidity, airQuality, vibration } = sensors;
  let score = 0;

  if (temperature > 45 || temperature < -10) score += 3;
  else if (temperature > 35 || temperature < 0) score += 1;

  if (humidity > 90) score += 2;
  else if (humidity > 75) score += 1;

  if (airQuality > 200) score += 3;
  else if (airQuality > 100) score += 2;
  else if (airQuality > 50) score += 1;

  if (vibration > 7) score += 3;
  else if (vibration > 4) score += 1;

  if (score >= 6) return 'critical';
  if (score >= 3) return 'attention';
  return 'safe';
}

// ─── AI recommendation helper ────────────────────────────────────────────
export function generateRecommendation(
  sensors: SensorReading,
  risk: RiskLevel
): string {
  if (risk === 'critical') {
    const issues: string[] = [];
    if (sensors.airQuality > 200) issues.push('qualidade do ar comprometida');
    if (sensors.temperature > 45) issues.push('temperatura extremamente alta');
    if (sensors.temperature < -10) issues.push('temperatura extremamente baixa');
    if (sensors.vibration > 7) issues.push('instabilidade estrutural detectada');
    return `Ambiente crítico para entrada humana. ${issues.join(', ')}. Recomenda-se manter operação remota e evitar entrada sem equipamento adequado.`;
  }
  if (risk === 'attention') {
    return `Ambiente requer atenção. Monitorar de perto antes de prosseguir. Utilize equipamentos de proteção adequados.`;
  }
  return `Ambiente dentro dos parâmetros seguros. Condições favoráveis para operação. Mantenha monitoramento contínuo.`;
}

// ─── Mock data ───────────────────────────────────────────────────────────
const MOCK_LOGS: EnvironmentLog[] = [
  {
    id: '1',
    name: 'Caverna Esmeralda - Setor A',
    location: 'Parque Nacional, MG, Brasil',
    coordinates: { latitude: -19.897, longitude: -43.929 },
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    mode: 'exploration',
    sensors: { temperature: 18, humidity: 82, luminosity: 2, airQuality: 45, vibration: 1 },
    riskLevel: 'attention',
    aiRecommendation: 'Ambiente requer atenção. Umidade elevada pode comprometer equipamentos eletrônicos. Use proteção adequada.',
    batteryLevel: 87,
    hasConnection: true,
    isFavorite: true,
  },
  {
    id: '2',
    name: 'Mina Desativada - Nível 3',
    location: 'Região Mineira, MG, Brasil',
    coordinates: { latitude: -20.123, longitude: -44.001 },
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    mode: 'blackbox',
    sensors: { temperature: 32, humidity: 91, luminosity: 0, airQuality: 210, vibration: 5 },
    riskLevel: 'critical',
    aiRecommendation: 'Ambiente crítico para entrada humana. qualidade do ar comprometida, instabilidade estrutural detectada. Recomenda-se manter operação remota.',
    batteryLevel: 42,
    hasConnection: false,
    isFavorite: false,
  },
  {
    id: '3',
    name: 'Túnel de Pesquisa - Setor B',
    location: 'Base Científica, SP, Brasil',
    coordinates: { latitude: -23.55, longitude: -46.633 },
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    mode: 'economy',
    sensors: { temperature: 22, humidity: 55, luminosity: 120, airQuality: 35, vibration: 0.5 },
    riskLevel: 'safe',
    aiRecommendation: 'Ambiente dentro dos parâmetros seguros. Condições favoráveis para operação. Mantenha monitoramento contínuo.',
    batteryLevel: 95,
    hasConnection: true,
    isFavorite: true,
  },
  {
    id: '4',
    name: 'Galeria Subterrânea - Ponto 7',
    location: 'Complexo Espeleológico, GO, Brasil',
    coordinates: { latitude: -15.77, longitude: -47.92 },
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    mode: 'alert',
    sensors: { temperature: 28, humidity: 70, luminosity: 8, airQuality: 95, vibration: 3 },
    riskLevel: 'attention',
    aiRecommendation: 'Ambiente requer atenção. Monitorar de perto antes de prosseguir. Utilize equipamentos de proteção adequados.',
    batteryLevel: 63,
    hasConnection: true,
    isFavorite: false,
  },
];

export function EnvironmentsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<EnvironmentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const saved = await AsyncStorage.getItem(LOGS_KEY);
      if (saved) {
        setLogs(JSON.parse(saved));
      } else {
        setLogs(MOCK_LOGS);
        await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(MOCK_LOGS));
      }
    } catch {
      setLogs(MOCK_LOGS);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLogs = async (updated: EnvironmentLog[]) => {
    setLogs(updated);
    await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(updated));
  };

  const addLog = (log: EnvironmentLog) => {
    saveLogs([log, ...logs]);
  };

  const toggleFavorite = (id: string) => {
    const updated = logs.map((l) =>
      l.id === id ? { ...l, isFavorite: !l.isFavorite } : l
    );
    saveLogs(updated);
  };

  const removeLog = (id: string) => {
    saveLogs(logs.filter((l) => l.id !== id));
  };

  const favorites = logs.filter((l) => l.isFavorite);

  return (
    <EnvironmentsContext.Provider
      value={{ logs, favorites, addLog, toggleFavorite, removeLog, isLoading }}
    >
      {children}
    </EnvironmentsContext.Provider>
  );
}

export function useEnvironments() {
  return useContext(EnvironmentsContext);
}
