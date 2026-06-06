import { RiskLevel, OperationMode, SensorReading } from '../types';

// ─── Risk ────────────────────────────────────────────────────────────────
export function getRiskColor(
  risk: RiskLevel,
  colors: { success: string; warning: string; danger: string; textMuted: string }
): string {
  switch (risk) {
    case 'safe': return colors.success;
    case 'attention': return colors.warning;
    case 'critical': return colors.danger;
    default: return colors.textMuted;
  }
}

export function getRiskLabel(risk: RiskLevel): string {
  switch (risk) {
    case 'safe': return 'Seguro';
    case 'attention': return 'Atenção';
    case 'critical': return 'Crítico';
    default: return 'Desconhecido';
  }
}

// ─── Mode ────────────────────────────────────────────────────────────────
export function getModeLabel(mode: OperationMode): string {
  switch (mode) {
    case 'exploration': return 'Exploração';
    case 'economy': return 'Economia';
    case 'blackbox': return 'Caixa-Preta';
    case 'alert': return 'Alerta';
  }
}

// ─── Sensors ─────────────────────────────────────────────────────────────
export function getSensorUnit(key: keyof SensorReading): string {
  switch (key) {
    case 'temperature': return '°C';
    case 'humidity': return '%';
    case 'luminosity': return 'lux';
    case 'airQuality': return 'AQI';
    case 'vibration': return '/10';
  }
}

export function getSensorLabel(key: keyof SensorReading): string {
  switch (key) {
    case 'temperature': return 'Temperatura';
    case 'humidity': return 'Umidade';
    case 'luminosity': return 'Luminosidade';
    case 'airQuality': return 'Qualidade do Ar';
    case 'vibration': return 'Vibração';
  }
}

// ─── Date ────────────────────────────────────────────────────────────────
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Agora mesmo';
  if (diffMin < 60) return `${diffMin}min atrás`;
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h atrás`;
  return date.toLocaleDateString('pt-BR');
}

// ─── Battery ─────────────────────────────────────────────────────────────
export function getBatteryColor(
  level: number,
  colors: { success: string; warning: string; danger: string }
): string {
  if (level > 50) return colors.success;
  if (level > 20) return colors.warning;
  return colors.danger;
}

// ─── ID generation ───────────────────────────────────────────────────────
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
