import { Button, TextInput, Group, Text, Stack } from '@mantine/core';
import { useState } from 'react';
import { AidStation } from '@/types';
import { parseLiveTrailXml } from '@/lib/liveTrail/parser';
import { validateLiveTrailUrl } from '@/utils/liveTrailParser';

interface LiveTrailLoaderProps {
  onLoad: (data: any) => void;
  url: string;
  onUrlChange: (url: string) => void;
}

export function LiveTrailLoader({ onLoad, url, onUrlChange }: LiveTrailLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (newUrl: string) => {
    onUrlChange(newUrl);
    if (validateLiveTrailUrl(newUrl)) {
      setError(null);
    } else {
      if (newUrl && !newUrl.startsWith('https://livetrail.net/histo/')) {
        setError('Invalid LiveTrail URL format. Expected: https://livetrail.net/histo/[race_name]/coureur.php?rech=[number]');
      }
    }
  };

  const handleLoad = async () => {
    if (!url) return;
    
    if (!validateLiveTrailUrl(url)) {
      setError('Invalid LiveTrail URL format');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch through our API route
      const response = await fetch(`/api/livetrail?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      const { data } = await response.json();
      
      // Parse the XML
      const parsedData = parseLiveTrailXml(data);
      console.log('Parsed race data:', parsedData);

      onLoad(parsedData);
    } catch (error) {
      console.error('Error loading race data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load race data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack>
      <Group align="flex-start">
        <TextInput
          placeholder="Enter LiveTrail URL (e.g., https://livetrail.net/histo/canyons_2024/coureur.php?rech=1000)"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button 
          onClick={handleLoad}
          loading={isLoading}
          disabled={!validateLiveTrailUrl(url)}
        >
          Load from LiveTrail
        </Button>
      </Group>
      {error && (
        <Text c="red" size="sm">
          {error}
        </Text>
      )}
    </Stack>
  );
} 