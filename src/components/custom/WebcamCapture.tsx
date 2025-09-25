'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';

interface WebcamCaptureProps {
  onCapture?: (imageSrc: string) => void;
  className?: string;
  resetTrigger?: number; // Para forçar reset externamente
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, className = '', resetTrigger }) => {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCaptured, setIsCaptured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(true);
  // Removido o estado mounted que estava causando problemas de hidratação

  // Reset quando resetTrigger mudar
  useEffect(() => {
    if (resetTrigger !== undefined && resetTrigger > 0) {
      console.log('🔄 Resetando WebcamCapture...', resetTrigger);
      setImageSrc(null);
      setIsCaptured(false);
      setError(null);
      setCountdown(null);
      // Força re-render do Webcam
      if (webcamRef.current) {
        webcamRef.current.video?.load();
      }
    }
  }, [resetTrigger]);

  const capture = useCallback(() => {
    console.log('Função capture chamada');
    if (webcamRef.current && webcamRef.current.video) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        console.log('Foto capturada com sucesso');
        setImageSrc(imageSrc);
        setIsCaptured(true);
        onCapture?.(imageSrc);
      } else {
        console.log('Erro ao capturar foto');
      }
    } else {
      console.log('Webcam ref não encontrada ou video não carregado');
    }
  }, [onCapture]);

  const startCountdown = useCallback(() => {
    if (countdown !== null || isCaptured) {
      console.log('Countdown já em andamento ou foto já capturada, ignorando...');
      return;
    }
    
    console.log('🚀 INICIANDO COUNTDOWN...', { countdown, isCaptured });
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        console.log('Countdown:', prev);
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          // Capturar foto após countdown
          setTimeout(() => {
            console.log('Capturando foto...');
            capture();
            setCountdown(null);
          }, 100);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [capture, countdown, isCaptured]);

  const retake = useCallback(() => {
    console.log('Retake chamado');
    setImageSrc(null);
    setIsCaptured(false);
    setError(null);
    setCountdown(null);
  }, []);

  const toggleFlip = useCallback(() => {
    console.log('Toggle flip chamado, estado atual:', isFlipped);
    setIsFlipped(prev => {
      console.log('Novo estado flip:', !prev);
      return !prev;
    });
  }, [isFlipped]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 CLIQUE DETECTADO!', {
      target: e.target,
      currentTarget: e.currentTarget,
      type: e.type,
      clientX: e.clientX,
      clientY: e.clientY,
      timestamp: Date.now()
    });
    startCountdown();
  };

  const handleTouch = (e: React.TouchEvent) => {
    e.stopPropagation();
    console.log('📱 TOUCH DETECTADO!', {
      target: e.target,
      currentTarget: e.currentTarget,
      type: e.type,
      touches: e.touches[0],
      timestamp: Date.now()
    });
    startCountdown();
  };

  const videoConstraints = {
    width: 600,
    height: 800,
    facingMode: 'user',
  };

  const handleUserMediaError = (error: string | DOMException) => {
    console.error('Erro ao acessar câmera:', error);
    setError('Não foi possível acessar a câmera. Verifique as permissões.');
  };

  // Renderizar diretamente sem verificação de mounted
  console.log('📷 WebcamCapture renderizando...', { isCaptured, countdown, isFlipped });

  if (error) {
    return (
      <div className={`totem-card text-center ${className}`}>
        <div className="space-y-3">
          <h3 className="totem-title">📷 Câmera Indisponível</h3>
          <p className="totem-text text-destructive">{error}</p>
          <button onClick={retake} className="totem-button">
            TENTAR NOVAMENTE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="space-y-3">
        {!isCaptured ? (
          <div className="space-y-3">
            <div className="relative mx-auto w-20 h-24 border-4 border-foreground shadow-brutal overflow-hidden">
                     <Webcam
                       ref={webcamRef}
                       audio={false}
                       screenshotFormat="image/jpeg"
                       videoConstraints={videoConstraints}
                       onUserMediaError={handleUserMediaError}
                       className="h-full object-cover webcam-filter cursor-pointer"
                       style={{ 
                         transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)',
                         width: '80%'
                       }}
                       onClick={handleClick}
                       onTouchStart={handleTouch}
                     />
              
              {/* Overlay com efeitos visuais */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="webcam-noise"></div>
                <div className="webcam-scanlines"></div>
                <div className="webcam-glitch"></div>
              </div>
              
              {/* Área clicável removida - agora o clique é diretamente no Webcam */}
              
              {/* Contador de 3 segundos */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 countdown-overlay" style={{ zIndex: 20 }}>
                  <div className="text-9xl font-bold text-white countdown-number drop-shadow-2xl">
                    {countdown}
                  </div>
                </div>
              )}
              
              {/* Botão de flip */}
              <button
                onClick={toggleFlip}
                className="absolute top-4 right-4 totem-button text-xl py-2 px-4"
                style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)', zIndex: 30 }}
                title="Virar câmera"
              >
                🔄 FLIP
              </button>
            </div>
            
            {/* Botão de captura com toque na tela */}
            <button 
              onClick={startCountdown} 
              className="totem-button text-sm py-2"
              disabled={countdown !== null}
            >
              {countdown !== null ? `⏱️ ${countdown}` : '📸 TOCAR PARA FOTOGRAFAR'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative mx-auto w-20 h-24 border-4 border-foreground shadow-brutal overflow-hidden">
                     <img
                       src={imageSrc || ''}
                       alt="Selfie capturada"
                       className="object-cover webcam-filter"
                       style={{
                         transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)',
                         width: '50%',
                         height: 'auto'
                       }}
                     />
              
              {/* Overlay com efeitos visuais */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="webcam-noise"></div>
                <div className="webcam-scanlines"></div>
                <div className="webcam-glitch"></div>
              </div>

              {/* Botão de flip */}
              <button
                onClick={toggleFlip}
                className="absolute top-4 right-4 totem-button text-xl py-2 px-4"
                style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)', zIndex: 30 }}
                title="Virar câmera"
              >
                🔄 FLIP
              </button>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={retake} 
                className="totem-button flex-1 text-2xl py-4" 
                style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
              >
                🔄 TIRAR NOVA FOTO
              </button>
              <button 
                onClick={() => onCapture?.(imageSrc || '')} 
                className="totem-button flex-1 text-2xl py-4"
              >
                ✅ CONFIRMAR FOTO
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;