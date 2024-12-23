import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useApiKey } from '@/hooks/use-api-key';

interface ApiKeyInputProps {
  onSave?: () => void;
}

export const ApiKeyInput = ({ onSave }: ApiKeyInputProps) => {
  const [inputKey, setInputKey] = useState('');
  const { apiKey, updateApiKey } = useApiKey();

  useEffect(() => {
<<<<<<< HEAD
    const savedKey = localStorage.getItem('googleMapsApiKey');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('googleMapsApiKey', apiKey);
    toast({
      title: "API Key Saved",
      description: "Your Google Maps API key has been saved successfully.",
    });
=======
    if (apiKey) {
      setInputKey(apiKey);
    }
  }, [apiKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateApiKey(inputKey);
>>>>>>> ab8847a (Update color variables and text sizes, remove unused styles, refactor sidebar and places service.)
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
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="Enter your API key"
          className="flex-1"
        />
        <Button type="submit">Save Key</Button>
      </div>
    </form>
  );
};