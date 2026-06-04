import { useState, useEffect } from 'react';
import { NasaApod, MarsPhoto } from '../types';
import { fetchApod, fetchMarsPhotos } from '../services/nasaService';

export function useApod() {
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
        if (mounted) setError('Não foi possível carregar a imagem da NASA.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, []);

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
        if (mounted) setPhotos(data);
      })
      .catch(() => {
        if (mounted) setError('Não foi possível carregar fotos de Marte.');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, [sol]);

  return { photos, isLoading, error };
}
