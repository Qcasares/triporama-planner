import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyInputProps {
  onSave?: () => void;
}

export const ApiKeyInput = ({ onSave }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('googleMapsApiKey');
      if (savedKey) {
        setApiKey(savedKey);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      toast({
        title: "Error",
        description: "Could not load API key from local storage.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('googleMapsApiKey', apiKey);
    toast({
      title: "API Key Saved",
      description: "Your Google Maps API key has been saved successfully.",
    });
    onSave?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Enter your Google Maps API key to enable mapping features. You can get one from the{' '}
          <a 
            href="https://console.cloud.google.com/google/maps-apis/credentials" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Cloud Console
          </a>
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
          className="flex-1"
        />
        <Button type="submit">Save Key</Button>
      </div>
    </form>
  );
};
