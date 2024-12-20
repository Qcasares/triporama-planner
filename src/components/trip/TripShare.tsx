import React, { useState } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { tripService } from '@/services/tripService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Share2, Download, Mail, Calendar } from 'lucide-react';

export const TripShare = () => {
  const { state } = useTrip();
  const { currentTrip } = state;
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('viewer');
  const { toast } = useToast();

  if (!currentTrip) return null;

  const handleShare = async () => {
    try {
      await tripService.addCollaborator(currentTrip.id, {
        email,
        role,
        joinedAt: new Date().toISOString(),
      });
      toast({
        title: 'Invitation sent',
        description: `${email} has been invited to collaborate on this trip.`,
      });
      setEmail('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation.',
        variant: 'destructive',
      });
    }
  };

  const handleExportPDF = async () => {
    try {
      await tripService.exportTripToPDF(currentTrip.id);
      toast({
        title: 'Success',
        description: 'Trip exported to PDF successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export trip to PDF.',
        variant: 'destructive',
      });
    }
  };

  const handleExportCalendar = async () => {
    try {
      await tripService.exportTripToCalendar(currentTrip.id);
      toast({
        title: 'Success',
        description: 'Trip exported to calendar successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export to calendar.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Share2 className="mr-2 h-4 w-4" />
            Share Trip
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Trip</DialogTitle>
            <DialogDescription>
              Invite others to view or edit your trip plan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="email"
                placeholder="Email address"
                className="col-span-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Select value={role} onValueChange={(value: 'editor' | 'viewer') => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleShare}>
              <Mail className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex space-x-2">
        <Button variant="outline" className="flex-1" onClick={handleExportPDF}>
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
        <Button variant="outline" className="flex-1" onClick={handleExportCalendar}>
          <Calendar className="mr-2 h-4 w-4" />
          Export Calendar
        </Button>
      </div>

      {currentTrip.shareUrl && (
        <div className="flex items-center space-x-2">
          <Input
            readOnly
            value={currentTrip.shareUrl}
            className="flex-1"
          />
          <Button
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(currentTrip.shareUrl!);
              toast({
                title: 'Copied',
                description: 'Share link copied to clipboard.',
              });
            }}
          >
            Copy
          </Button>
        </div>
      )}
    </div>
  );
};
