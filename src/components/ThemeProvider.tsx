'use client';

import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Força o tema dark no HTML
    document.documentElement.className = 'dark';
  }, []);

  if (!mounted) {
    return (
      <html lang="pt-BR" className="dark">
        <body className="antialiased">
          {children}
        </body>
      </html>
    );
  }

  return <>{children}</>;
}
