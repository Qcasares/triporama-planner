import { Loader2 } from 'lucide-react';
import { Progress } from '../ui/progress';

interface LoadingStateProps {
  progress: number;
}

export const LoadingState = ({ progress }: LoadingStateProps) => (
  <div className="flex min-h-screen items-center justify-center bg-[#F1F0FB] p-4">
    <div className="w-full max-w-md space-y-6 motion-safe:animate-fade-in">
      <div className="space-y-4">
        <Progress value={progress} className="transition-all duration-300" />
        <div className="h-2 w-full bg-primary/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary/10 transition-all duration-300 animate-pulse"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <h2 className="text-xl font-semibold tracking-tight text-primary">
            Loading your trip planner...
          </h2>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          We're getting everything ready for you
        </p>
      </div>
    </div>
  </div>
);