'use client';

import { useState } from 'react';

export default function TestComponent() {
  const [isDark, setIsDark] = useState(true); // Start with dark theme

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="p-8 space-y-6">
      {/* Test div to ensure CSS is working */}
      <div className="test-visible">
        <h2>Teste de Visibilidade - Se você vê isso, o CSS está funcionando!</h2>
      </div>
      
      <div className="brutal-card max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Teste de Configuração - Tema Brutalist
        </h2>
        
        <div className="space-y-4">
          <div className="brutal-input w-full">
            Input de teste
          </div>
          
          <button 
            onClick={toggleTheme}
            className="brutal-button w-full"
          >
            Alternar Tema {isDark ? '🌙' : '☀️'}
          </button>
          
          <div className="grid grid-cols-3 gap-2">
            <button className="game-button game-button-a">A</button>
            <button className="game-button game-button-b">B</button>
            <button className="game-button game-button-c">C</button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Tema atual: {isDark ? 'Dark' : 'Light'}
            </p>
          </div>
        </div>
      </div>

      {/* Retro Arcade Color Palette */}
      <div className="brutal-card max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-4">Paleta de Cores Retro Arcade</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 retro-primary rounded text-center font-bold">
            Primary
          </div>
          <div className="p-4 retro-secondary rounded text-center font-bold">
            Secondary
          </div>
          <div className="p-4 retro-accent rounded text-center font-bold">
            Accent
          </div>
          <div className="p-4 retro-destructive rounded text-center font-bold">
            Destructive
          </div>
        </div>
      </div>
    </div>
  );
}