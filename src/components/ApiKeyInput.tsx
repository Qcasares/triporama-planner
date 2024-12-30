import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useApiKey } from '../hooks/use-api-key';

interface ApiKeyInputProps {
  onSave?: () => void;
}

export const ApiKeyInput = ({ onSave }: ApiKeyInputProps) => {
  const [inputKey, setInputKey] = useState('');
  const { apiKey, updateApiKey } = useApiKey();

  useEffect(() => {
    if (apiKey) {
      setInputKey(apiKey);
    }
  }, [apiKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateApiKey(inputKey);
    onSave?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Enter your mapping service API key to enable mapping features.
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          type="password"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder="Enter your mapping service API key"
          className="flex-1"
        />
        <Button type="submit">Save Key</Button>
      </div>
    </form>
  );
};
