import useSWR from 'swr';
import { Participant, ParticipantsResponse } from '@/types/participant';

const fetcher = async (url: string): Promise<ParticipantsResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Falha ao buscar participantes');
  }
  return response.json();
};

export function useParticipants() {
  const { data, error, isLoading, mutate } = useSWR<ParticipantsResponse>(
    '/api/participants',
    fetcher,
    {
      refreshInterval: 5000, // Atualiza a cada 5 segundos
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    participants: data?.participants || [],
    isLoading,
    error,
    mutate,
  };
}
