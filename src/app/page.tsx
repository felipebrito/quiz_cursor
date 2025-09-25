import TestComponent from '@/components/TestComponent';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-6xl font-bold text-center mb-8 font-display">
          Quiz Show Interativo
        </h1>
        <TestComponent />
      </div>
    </div>
  );
}