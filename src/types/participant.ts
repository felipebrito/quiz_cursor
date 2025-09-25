export interface Participant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  selfieUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParticipantWithGames extends Participant {
  games: {
    id: string;
    status: string;
    createdAt: Date;
  }[];
}

export interface ParticipantsResponse {
  success: boolean;
  participants: Participant[];
  error?: string;
}
