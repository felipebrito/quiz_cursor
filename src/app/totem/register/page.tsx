'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RegistrationForm from '@/components/totem/RegistrationForm';

export default function TotemRegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSuccess = () => {
    // Esta função será chamada pelo RegistrationForm quando o cadastro for bem-sucedido
    console.log('Cadastro realizado com sucesso!');
    // A função handleFormSuccess do RegistrationForm será chamada automaticamente
  };

  const handleRegistration = async (data: { name: string; email?: string; phone?: string; selfieImage?: string | null }) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Sucesso será tratado pelo RegistrationForm
        console.log('Cadastro realizado com sucesso!');
      } else {
        throw new Error(result.message || 'Erro no cadastro');
      }
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert(`❌ Erro ao realizar cadastro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <RegistrationForm 
          onSubmit={handleRegistration} 
          onSuccess={handleFormSuccess}
          isLoading={isLoading} 
        />
      </div>
    </MainLayout>
  );
}
