import Starfield from '@/components/Starfield';
import ProfileCard from '@/components/ProfileCard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6">
      <Starfield />
      <ProfileCard />
    </div>
  );
};

export default Index;
