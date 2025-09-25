import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { CreateGameRequest, GameResponse, GamesResponse } from '@/types/game';

// Schema de validação para criação de jogo
const createGameSchema = z.object({
  name: z.string().min(1, 'Nome do jogo é obrigatório').max(100, 'Nome muito longo'),
  maxParticipants: z.number().min(2, 'Mínimo de 2 participantes').max(20, 'Máximo de 20 participantes'),
  participantIds: z.array(z.string()).optional(),
});

// POST - Criar novo jogo
export async function POST(request: NextRequest) {
  try {
    const body: CreateGameRequest = await request.json();
    
    // Validar dados de entrada
    const validatedData = createGameSchema.parse(body);
    
    // Verificar se existem participantes disponíveis
    const availableParticipants = await prisma.participant.findMany({
      where: {
        games: {
          none: {
            game: {
              status: {
                in: ['waiting', 'active']
              }
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        selfieUrl: true,
      }
    });

    if (availableParticipants.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nenhum participante disponível para o jogo',
        },
        { status: 400 }
      );
    }

    // Se participantIds não foi fornecido, selecionar participantes aleatoriamente
    let selectedParticipants = availableParticipants;
    if (validatedData.participantIds && validatedData.participantIds.length > 0) {
      selectedParticipants = availableParticipants.filter(p => 
        validatedData.participantIds!.includes(p.id)
      );
    }

    // Limitar ao número máximo de participantes
    const participantsToAdd = selectedParticipants.slice(0, validatedData.maxParticipants);

    // Criar o jogo
    const game = await prisma.game.create({
      data: {
        name: validatedData.name,
        status: 'waiting',
        maxParticipants: validatedData.maxParticipants,
        currentParticipants: participantsToAdd.length,
        participants: {
          create: participantsToAdd.map(participant => ({
            participantId: participant.id,
            joinedAt: new Date(),
          }))
        }
      },
      include: {
        participants: {
          include: {
            participant: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                selfieUrl: true,
              }
            }
          }
        }
      }
    });

    // Transformar dados para o formato esperado
    const gameWithParticipants = {
      ...game,
      participants: game.participants.map(gp => ({
        id: gp.participant.id,
        name: gp.participant.name,
        email: gp.participant.email,
        phone: gp.participant.phone,
        selfieUrl: gp.participant.selfieUrl,
        joinedAt: gp.joinedAt,
      }))
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Jogo criado com sucesso!',
        game: gameWithParticipants,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dados inválidos',
          error: error.errors[0].message,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        error: 'Erro ao criar jogo',
      },
      { status: 500 }
    );
  }
}

// GET - Listar jogos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const whereClause = status ? { status: status as any } : {};
    
    const games = await prisma.game.findMany({
      where: whereClause,
      include: {
        participants: {
          include: {
            participant: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                selfieUrl: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    // Transformar dados para o formato esperado
    const gamesWithParticipants = games.map(game => ({
      ...game,
      participants: game.participants.map(gp => ({
        id: gp.participant.id,
        name: gp.participant.name,
        email: gp.participant.email,
        phone: gp.participant.phone,
        selfieUrl: gp.participant.selfieUrl,
        joinedAt: gp.joinedAt,
      }))
    }));

    return NextResponse.json({
      success: true,
      games: gamesWithParticipants,
    });
    
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao buscar jogos',
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}
