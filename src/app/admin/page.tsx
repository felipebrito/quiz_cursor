'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/admin/DataTable';
import { participantColumns } from '@/components/admin/participantColumns';
import { useParticipants } from '@/hooks/useParticipants';
import { Button } from '@/components/ui/button';
import { Participant } from '@/types/participant';

export default function AdminPage() {
  const { participants, isLoading, error, mutate } = useParticipants();
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  const handleStartGame = async () => {
    if (selectedParticipants.length !== 3) {
      alert('Selecione exatamente 3 participantes para iniciar o jogo');
      return;
    }

    setIsCreatingGame(true);
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Jogo ${new Date().toLocaleString('pt-BR')}`,
          maxParticipants: 3,
          participantIds: selectedParticipants.map(p => p.id),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar jogo');
      }

      const result = await response.json();
      console.log('Jogo criado:', result);
      
      // Limpar seleção e atualizar lista
      setSelectedParticipants([]);
      mutate();
      
      alert(`Jogo "${result.game.name}" criado com sucesso!`);
    } catch (error) {
      console.error('Erro ao criar jogo:', error);
      alert('Erro ao criar jogo. Tente novamente.');
    } finally {
      setIsCreatingGame(false);
    }
  };

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
                  onClick={handleStartGame}
                  disabled={selectedParticipants.length !== 3 || isCreatingGame}
                >
                  {isCreatingGame ? '⏳ Criando...' : '🎯 Iniciar Jogo (3)'}
                </Button>
              </div>
              {selectedParticipants.length > 0 && (
                <div className="mt-4 p-4 border-2 border-foreground shadow-brutal bg-muted">
                  <p className="totem-text text-sm text-center">
                    {selectedParticipants.length} participante(s) selecionado(s): {selectedParticipants.map(p => p.name).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <DataTable
          columns={participantColumns}
          data={participants}
          searchKey="name"
          searchPlaceholder="Buscar por nome..."
          title={`Participantes Cadastrados (${participants.length})`}
          onSelectionChange={setSelectedParticipants}
        />
      </div>
    </div>
  );
}
