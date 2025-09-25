import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema de validação para o cadastro
const createParticipantSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').optional().or(z.literal('')),
  selfieImage: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = createParticipantSchema.parse(body);
    
    // Criar participante no banco de dados
    const participant = await prisma.participant.create({
      data: {
        name: validatedData.name,
        // Não salvar email e phone vazios
        ...(validatedData.email && { email: validatedData.email }),
        ...(validatedData.phone && { phone: validatedData.phone }),
        // Salvar selfie se fornecida
        ...(validatedData.selfieImage && { selfieUrl: validatedData.selfieImage }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Participante cadastrado com sucesso!',
        participant: {
          id: participant.id,
          name: participant.name,
          email: participant.email || null,
          phone: participant.phone || null,
          selfieUrl: participant.selfieUrl || null,
        },
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Erro ao criar participante:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      participants,
    });
    
  } catch (error) {
    console.error('Erro ao buscar participantes:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao buscar participantes',
      },
      { status: 500 }
    );
  }
}
