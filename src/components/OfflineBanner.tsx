import { useOffline } from '../hooks/use-offline';
import { cn } from '../lib/utils';

export const OfflineBanner = () => {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-yellow-500 text-white text-center p-2",
      "animate-slide-up"
    )}>
      You are currently offline. Some features may be limited.
    </div>
  );
};
