import TestComponent from '@/components/TestComponent';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-6xl font-bold text-center mb-8 font-display">
          Quiz Show Interativo
        </h1>
        
        {/* shadcn/ui Components Test */}
        <div className="mb-8 space-y-4">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Teste shadcn/ui</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Este é um card do shadcn/ui funcionando!</p>
              <div className="flex gap-2">
                <Button>Botão Primário</Button>
                <Button variant="secondary">Botão Secundário</Button>
                <Button variant="outline">Botão Outline</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <TestComponent />
      </div>
    </MainLayout>
  );
}