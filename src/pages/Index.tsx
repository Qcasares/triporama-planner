import { TripPlanner } from '@/components/TripPlanner';
import { Header } from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <TripPlanner />
      </main>
    </div>
  );
};

export default Index;