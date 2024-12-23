import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('googleMapsApiKey') || '');
  const { toast } = useToast();

  const updateApiKey = (newKey: string) => {
    localStorage.setItem('googleMapsApiKey', newKey);
    setApiKey(newKey);
    toast({
      title: "API Key Updated",
      description: "Your Google Maps API key has been updated successfully.",
    });
  };

  return { apiKey, updateApiKey };
};