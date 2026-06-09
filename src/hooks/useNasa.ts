import { useState, useEffect } from 'react';
import { NasaApod, MarsPhoto } from '../types';
import { fetchApod, fetchMarsPhotos, getMockApod, getMockMarsPhotos } from '../services/nasaService';

export function useApod(refreshKey: number = 0) {
  const [apod, setApod] = useState<NasaApod | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    fetchApod()
      .then((data) => {
        if (mounted) setApod(data);
      })
      .catch(() => {
        // Fallback para mock quando API não responde (rate limit ou sem conexão)
        if (mounted) {
          setApod(getMockApod());
          setError('Exibindo dados de exemplo. Configure sua NASA API key para dados reais.');
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => { mounted = false; };
  }, [refreshKey]);

  return { apod, isLoading, error };
}

export function useMarsPhotos(sol: number = 1000) {
  const [photos, setPhotos] = useState<MarsPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    fetchMarsPhotos(sol)
      .then((data) => {
        if (mounted) {
          // Se a API retornou mas sem fotos, usa mock
          setPhotos(data.length > 0 ? data : getMockMarsPhotos());
        }
      })
      .catch(() => {
        // Fallback para mock quando API não responde
        if (mounted) {
          setPhotos(getMockMarsPhotos());
          setError('Exibindo fotos de exemplo. Configure sua NASA API key para dados reais.');
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => { mounted = false; };
  }, [sol]);

  return { photos, isLoading, error };
}
