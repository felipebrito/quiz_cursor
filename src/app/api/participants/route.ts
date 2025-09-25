import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Schema de validação para o cadastro
const createParticipantSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').optional().or(z.literal('')),
});

// Função para salvar arquivo de selfie
async function saveSelfieFile(file: formidable.File): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Garantir que o diretório existe
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Gerar nome único para o arquivo
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = path.extname(file.originalFilename || '');
  const fileName = `selfie_${timestamp}_${randomString}${fileExtension}`;
  const filePath = path.join(uploadDir, fileName);
  
  // Ler o arquivo e salvar
  const fileData = fs.readFileSync(file.filepath);
  fs.writeFileSync(filePath, fileData);
  
  // Retornar URL relativa
  return `/uploads/${fileName}`;
}

export async function POST(request: NextRequest) {
  try {
    // Configurar formidable para parsing de multipart/form-data
    const formData = await request.formData();
    
    // Extrair dados do formulário
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const selfieFile = formData.get('selfie') as File;
    
    // Validar dados de entrada
    const validatedData = createParticipantSchema.parse({
      name,
      email: email || '',
      phone: phone || '',
    });
    
    let selfieUrl: string | null = null;
    
    // Processar arquivo de selfie se fornecido
    if (selfieFile && selfieFile.size > 0) {
      // Converter File para formidable.File
      const buffer = await selfieFile.arrayBuffer();
      const tempFilePath = path.join(process.cwd(), 'temp', `temp_${Date.now()}_${selfieFile.name}`);
      
      // Garantir que o diretório temp existe
      const tempDir = path.dirname(tempFilePath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Salvar arquivo temporário
      fs.writeFileSync(tempFilePath, Buffer.from(buffer));
      
      // Criar objeto File para formidable
      const formidableFile: formidable.File = {
        filepath: tempFilePath,
        originalFilename: selfieFile.name,
        mimetype: selfieFile.type,
        size: selfieFile.size,
      };
      
      // Salvar selfie e obter URL
      selfieUrl = await saveSelfieFile(formidableFile);
      
      // Limpar arquivo temporário
      fs.unlinkSync(tempFilePath);
    }
    
    // Criar participante no banco de dados
    const participant = await prisma.participant.create({
      data: {
        name: validatedData.name,
        // Não salvar email e phone vazios
        ...(validatedData.email && { email: validatedData.email }),
        ...(validatedData.phone && { phone: validatedData.phone }),
        // Salvar selfie se fornecida
        ...(selfieUrl && { selfieUrl }),
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
