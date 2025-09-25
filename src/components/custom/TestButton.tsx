'use client';

import React, { useState, useEffect } from 'react';

const TestButton: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    console.log('TestButton montado no cliente!');
  }, []);

  const handleClick = () => {
    console.log('Botão clicado!');
    setCount(prev => prev + 1);
  };

  if (!mounted) {
    return <div className="text-2xl">Carregando botão...</div>;
  }

  return (
    <div className="space-y-4">
      <button 
        onClick={handleClick}
        className="totem-button text-2xl py-4 px-8"
      >
        TESTE: {count}
      </button>
      <p className="text-center">Clique no botão para testar</p>
    </div>
  );
};

export default TestButton;
