'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import WebcamCapture from '@/components/custom/WebcamCapture';

// Schema de validação
const registrationSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').optional().or(z.literal('')),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onSubmit: (data: RegistrationFormData & { selfieImage?: string | null }) => void;
  onSuccess?: () => void;
  isLoading?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, onSuccess, isLoading = false }) => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'camera' | 'form' | 'success'>('camera');
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const handleSubmit = (data: RegistrationFormData) => {
    onSubmit({ ...data, selfieImage });
  };

  const handleSelfieCapture = (imageSrc: string) => {
    setSelfieImage(imageSrc);
    setCurrentStep('form');
  };

  const handleRetakeSelfie = () => {
    setSelfieImage(null);
    setCurrentStep('camera');
    setResetTrigger(prev => prev + 1); // Força reset do WebcamCapture
  };

  const handleFormSuccess = () => {
    setCurrentStep('success');
    // Volta para a câmera após 3 segundos
    setTimeout(() => {
      console.log('🔄 Resetando formulário e voltando para câmera...');
      setCurrentStep('camera');
      setSelfieImage(null);
      form.reset();
      setResetTrigger(prev => {
        console.log('🔄 Incrementando resetTrigger:', prev + 1);
        return prev + 1;
      }); // Força reset do WebcamCapture
    }, 3000);
  };

  // Chama onSuccess quando o formulário é submetido com sucesso
  const handleSubmitWithSuccess = async (data: RegistrationFormData) => {
    try {
      // Criar FormData para envio de arquivo
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.email) formData.append('email', data.email);
      if (data.phone) formData.append('phone', data.phone);
      
      // Converter base64 para File se selfie existir
      if (selfieImage) {
        const response = await fetch(selfieImage);
        const blob = await response.blob();
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
        formData.append('selfie', file);
      }
      
      // Enviar dados para API
      const response = await fetch('/api/participants', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Falha ao cadastrar participante');
      }
      
      const result = await response.json();
      console.log('Participante cadastrado:', result);
      
      // Se chegou até aqui, o cadastro foi bem-sucedido
      if (onSuccess) {
        onSuccess();
      }
      // Chama a função de sucesso para resetar e voltar à câmera
      handleFormSuccess();
    } catch (error) {
      // Erro será tratado pela página
      console.error('Erro no cadastro:', error);
    }
  };

  // Tela de boas-vindas (apenas na primeira vez)
  if (currentStep === 'welcome') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="totem-card max-w-2xl">
          <div className="space-y-8 text-center">
            <h1 className="totem-title text-6xl">
              🎮 Quiz Show Interativo
            </h1>
            <p className="totem-subtitle text-3xl">
              Bem-vindo ao nosso quiz show!
            </p>
            <button
              onClick={() => setCurrentStep('camera')}
              className="totem-button text-4xl px-16 py-8"
            >
              COMEÇAR CADASTRO
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela da câmera (tela principal)
  if (currentStep === 'camera') {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xs flex flex-col items-center">
                 <WebcamCapture
                   key={resetTrigger}
                   onCapture={handleSelfieCapture}
                   className="w-auto"
                   resetTrigger={resetTrigger}
                 />
        </div>
      </div>
    );
  }

  // Tela do formulário
  if (currentStep === 'form') {
    return (
      <div className="h-screen flex flex-col items-center justify-start p-2 pt-4">
        <div className="w-full max-w-xs">
          {/* Preview da selfie */}
          {selfieImage && (
            <div className="text-center mb-2">
              <div className="relative mx-auto w-12 h-16 border border-foreground shadow-brutal mb-1">
                <img
                  src={selfieImage}
                  alt="Selfie capturada"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRetakeSelfie}
                className="totem-button mb-1 text-xs py-0.5 px-1 text-center"
                disabled={isLoading}
                style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
              >
                🔄 NOVA FOTO
              </button>
            </div>
          )}
          
          <div className="totem-card">
            <div className="space-y-0.5">
              <h2 className="totem-title text-xs text-center">
                Cadastro de Participante
              </h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitWithSuccess)} className="space-y-0.5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="totem-label text-xs">Nome Completo *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Digite seu nome completo"
                            className="totem-input text-xs py-0.5 h-6"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="totem-error" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="totem-label text-xs">Email (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="seu@email.com"
                            className="totem-input text-xs py-0.5 h-6"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="totem-error" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="totem-label text-xs">Telefone (Opcional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="(11) 99999-9999"
                            className="totem-input text-xs py-0.5 h-6"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="totem-error" />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-1 pt-1">
                    <button
                      type="button"
                      onClick={handleRetakeSelfie}
                      className="totem-button flex-1 text-xs py-0.5 h-6"
                      disabled={isLoading}
                      style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
                    >
                      VOLTAR
                    </button>
                    <button
                      type="submit"
                      className="totem-button flex-1 text-xs py-0.5 h-6"
                      disabled={isLoading}
                    >
                      {isLoading ? 'CADASTRANDO...' : 'FINALIZAR CADASTRO'}
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de sucesso
  if (currentStep === 'success') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="totem-card max-w-2xl">
          <div className="space-y-8 text-center">
            <h1 className="totem-title text-6xl">
              🎉 Cadastro Realizado!
            </h1>
            <p className="totem-subtitle text-3xl">
              Aguarde... voltando para a câmera
            </p>
            <div className="animate-spin text-6xl">⏳</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RegistrationForm;
