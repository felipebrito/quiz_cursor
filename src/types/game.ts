export interface Game {
  id: string;
  name: string;
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  maxParticipants: number;
  currentParticipants: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface GameWithParticipants extends Game {
  participants: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    selfieUrl: string | null;
    joinedAt: Date;
  }[];
}

export interface CreateGameRequest {
  name: string;
  maxParticipants: number;
  participantIds?: string[];
}

export interface GameResponse {
  success: boolean;
  game?: GameWithParticipants;
  message?: string;
  error?: string;
}

export interface GamesResponse {
  success: boolean;
  games?: GameWithParticipants[];
  message?: string;
  error?: string;
}
