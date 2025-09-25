'use client';

import { useState } from 'react';

export default function TestComponent() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="brutal-card max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 font-display">Teste de Configuração</h2>
        
        <div className="space-y-4">
          <div className="brutal-input w-full" placeholder="Teste de input">
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
    </div>
  );
}
