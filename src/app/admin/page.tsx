'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/admin/DataTable';
import { participantColumns } from '@/components/admin/participantColumns';
import { useParticipants } from '@/hooks/useParticipants';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const { participants, isLoading, error, mutate } = useParticipants();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <Card className="totem-card">
            <CardHeader>
              <CardTitle className="totem-title text-4xl text-center">
                🎮 Painel Administrativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="totem-text text-lg">Carregando participantes...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <Card className="totem-card">
            <CardHeader>
              <CardTitle className="totem-title text-4xl text-center">
                🎮 Painel Administrativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="totem-text text-lg text-destructive">
                  Erro ao carregar participantes: {error.message}
                </p>
                <Button 
                  onClick={() => mutate()} 
                  className="totem-button"
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto space-y-6">
        <Card className="totem-card">
          <CardHeader>
            <CardTitle className="totem-title text-4xl text-center">
              🎮 Painel Administrativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <h2 className="totem-text text-2xl">
                Fila de Participantes
              </h2>
              <p className="totem-text text-lg">
                Gerencie os participantes cadastrados e inicie novos jogos
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  className="totem-button"
                  onClick={() => mutate()}
                >
                  🔄 Atualizar Lista
                </Button>
                <Button 
                  className="totem-button"
                  variant="outline"
                >
                  🎯 Iniciar Novo Jogo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <DataTable
          columns={participantColumns}
          data={participants}
          searchKey="name"
          searchPlaceholder="Buscar por nome..."
          title={`Participantes Cadastrados (${participants.length})`}
        />
      </div>
    </div>
  );
}
