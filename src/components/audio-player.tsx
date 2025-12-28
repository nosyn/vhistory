'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  word: string;
  accents?: Array<{
    label: string;
    dialect: 'North' | 'Central' | 'South';
    audioUrl?: string; // Will be optional until we have actual audio files
  }>;
}

export function AudioPlayer({ word, accents }: AudioPlayerProps) {
  const [currentAccent, setCurrentAccent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Default accents if none provided
  const accentVariations = accents || [
    { label: 'Northern', dialect: 'North' as const },
    { label: 'Central', dialect: 'Central' as const },
    { label: 'Southern', dialect: 'South' as const },
  ];

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = (index: number) => {
    const accent = accentVariations[index];

    // For now, show a message that audio is coming soon
    // In the future, this would play the actual audio file
    if (!accent.audioUrl) {
      console.log(
        `Playing pronunciation for ${word} in ${accent.label} accent`
      );
      // Simulate playing
      setIsPlaying(true);
      setCurrentAccent(index);

      // Auto-stop after 2 seconds (simulated)
      setTimeout(() => {
        setIsPlaying(false);
      }, 2000);
      return;
    }

    // Actual audio playback logic for when we have files
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(accent.audioUrl);
    audioRef.current = audio;
    audio.muted = isMuted;

    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    });

    audio.onended = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    setCurrentAccent(index);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  return (
    <Card className='border-sand-200 bg-white p-4'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Volume2 className='h-5 w-5 text-terracotta-600' />
            <span className='text-sm font-medium text-sand-700'>
              Pronunciation
            </span>
          </div>
          <Button
            size='sm'
            variant='ghost'
            onClick={toggleMute}
            className='h-8 w-8 p-0'
          >
            {isMuted ? (
              <VolumeX className='h-4 w-4 text-sand-400' />
            ) : (
              <Volume2 className='h-4 w-4 text-sand-600' />
            )}
          </Button>
        </div>

        <div className='flex flex-wrap gap-2'>
          {accentVariations.map((accent, index) => (
            <Button
              key={index}
              size='sm'
              variant={
                currentAccent === index && isPlaying ? 'default' : 'outline'
              }
              onClick={() => {
                if (isPlaying && currentAccent === index) {
                  handleStop();
                } else {
                  handlePlay(index);
                }
              }}
              className={cn('w-28',
                currentAccent === index && isPlaying
                  ? 'bg-terracotta-600 hover:bg-terracotta-700 text-white'
                  : 'border-sand-300 text-sand-700 hover:bg-sand-50'
              )}
            >
              <>
                {isPlaying && currentAccent === index ? (
                  <Pause className='mr-2 h-3 w-3' />
                ) : (
                  <Play className='mr-2 h-3 w-3' />
                )}
                {accent.label}
              </>
            </Button>
          ))}
        </div>

        {!accentVariations[0]?.audioUrl && (
          <p className='text-xs text-sand-400 italic'>
            Audio pronunciations coming soon
          </p>
        )}
      </div>
    </Card>
  );
}
