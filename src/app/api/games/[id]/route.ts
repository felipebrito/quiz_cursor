import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GameResponse } from '@/types/game';

// GET - Buscar jogo específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const game = await prisma.game.findUnique({
      where: { id: params.id },
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

    if (!game) {
      return NextResponse.json(
        {
          success: false,
          message: 'Jogo não encontrado',
        },
        { status: 404 }
      );
    }

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

    return NextResponse.json({
      success: true,
      game: gameWithParticipants,
    });
    
  } catch (error) {
    console.error('Erro ao buscar jogo:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        error: 'Erro ao buscar jogo',
      },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar status do jogo
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !['waiting', 'active', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Status inválido',
        },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    
    // Adicionar timestamps baseado no status
    if (status === 'active') {
      updateData.startedAt = new Date();
    } else if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const game = await prisma.game.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      message: `Jogo ${status === 'active' ? 'iniciado' : status === 'completed' ? 'finalizado' : 'atualizado'} com sucesso!`,
      game: gameWithParticipants,
    });
    
  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        error: 'Erro ao atualizar jogo',
      },
      { status: 500 }
    );
  }
}

// DELETE - Cancelar jogo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const game = await prisma.game.findUnique({
      where: { id: params.id },
    });

    if (!game) {
      return NextResponse.json(
        {
          success: false,
          message: 'Jogo não encontrado',
        },
        { status: 404 }
      );
    }

    if (game.status === 'active') {
      return NextResponse.json(
        {
          success: false,
          message: 'Não é possível cancelar um jogo ativo',
        },
        { status: 400 }
      );
    }

    // Atualizar status para cancelled
    await prisma.game.update({
      where: { id: params.id },
      data: { status: 'cancelled' },
    });

    return NextResponse.json({
      success: true,
      message: 'Jogo cancelado com sucesso!',
    });
    
  } catch (error) {
    console.error('Erro ao cancelar jogo:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        error: 'Erro ao cancelar jogo',
      },
      { status: 500 }
    );
  }
}
