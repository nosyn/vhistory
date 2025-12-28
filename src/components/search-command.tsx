'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/client';

interface SearchCommandProps {
  lang: string;
}

export function SearchCommand({ lang }: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Keyboard shortcut to open command
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.search.$get({ query: { q: query } });
        if (res.ok) {
          const data = await res.json();
          setResults(data.results);
        }
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback(
    (wordId: string) => {
      setOpen(false);
      setQuery('');
      router.push(`/${lang}/word/${wordId}`);
    },
    [lang, router]
  );

  return (
    <>
      <Button
        variant='outline'
        className='relative w-full justify-start text-sm border-2 border-sand-200 hover:border-terracotta-400 hover:bg-sand-50 transition-all h-12 rounded-full shadow-sm'
        onClick={() => setOpen(true)}
      >
        <Search className='mr-3 h-5 w-5 text-sand-400' />
        <span className='text-sand-400 font-serif'>Search words...</span>
        <kbd className='pointer-events-none absolute right-3 hidden h-6 select-none items-center gap-1 rounded-md border border-sand-200 bg-sand-50 px-2 font-mono text-xs font-medium text-sand-600 sm:flex'>
          <span>⌘</span>K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title='Search Words'
        description='Search for Vietnamese words and phrases'
        className='max-w-2xl'
      >
        <CommandInput
          placeholder='Search for a word or phrase... (e.g., "mô", "nhà", "xài")'
          value={query}
          onValueChange={setQuery}
          className='font-serif text-base'
        />
        <CommandList className='max-h-[400px]'>
          {loading && (
            <div className='py-8 text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta-500 mx-auto mb-3' />
              <p className='text-sm text-sand-500 font-serif'>Searching...</p>
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <CommandEmpty>
              <div className='py-8 text-center'>
                <p className='text-sand-500 font-serif italic mb-2'>
                  No words found for "{query}"
                </p>
                <p className='text-xs text-sand-400'>
                  Try searching for "mô", "nhà", or "xài"
                </p>
              </div>
            </CommandEmpty>
          )}
          {results.length > 0 && (
            <CommandGroup heading='Words' className='p-2'>
              {results.map((word: any) => (
                <CommandItem
                  key={word.id}
                  value={word.content}
                  onSelect={() => handleSelect(word.id)}
                  className='cursor-pointer rounded-lg p-4 mb-2 hover:bg-sand-50 border border-transparent hover:border-sand-200 transition-all'
                >
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center gap-3'>
                      <span className='text-xl font-serif font-bold text-terracotta-700'>
                        {word.content}
                      </span>
                      <Badge
                        variant='secondary'
                        className='text-xs bg-terracotta-100 text-terracotta-700 border-none'
                      >
                        {word.dialectType}
                      </Badge>
                    </div>
                    <p className='text-sm text-sand-600 leading-relaxed'>
                      {word.definition}
                    </p>
                    {word.usageExample && (
                      <p className='text-xs text-sand-500 italic mt-1'>
                        "{word.usageExample}"
                      </p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
