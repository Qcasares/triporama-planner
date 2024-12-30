import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Location } from '../../types/location';

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  SidebarContent: React.ComponentType;
}

export const MobileSidebar = ({ isOpen, setIsOpen, SidebarContent }: MobileSidebarProps) => (
  <Sheet open={isOpen} onOpenChange={setIsOpen}>
    <SheetTrigger asChild>
      <Button 
        variant="ghost" 
        size="icon"
        className={cn(
          "fixed left-4 top-4 z-50 md:hidden",
          "motion-safe:animate-slide-up",
          "bg-white/80 backdrop-blur-sm",
          "hover:bg-white/90 hover:scale-105",
          "active:scale-95",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-300"
        )}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-[300px] p-0 bg-white">
      <SidebarContent />
    </SheetContent>
  </Sheet>
);