'use client';

import { useState } from 'react';
import { MapPlaceholder } from '@/components/map-placeholder';
import { api } from '@/lib/client';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(false);
    try {
        const res = await api.search.$get({ query: { q: query } });
        if (res.ok) {
            const data = await res.json();
            setResults(data.results);
            setHasSearched(true);
        }
    } catch (error) {
        console.error("Search failed", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center bg-sand-50">
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-6xl font-serif font-black text-terracotta-800 tracking-tight">
                Trace the <span className="text-terracotta-500 italic">Origins</span>
            </h1>
            <p className="text-lg text-sand-500 max-w-xl mx-auto">
                A collaborative dictionary preserving the nuances of Vietnamese dialects across North, Central, and South regions.
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search a word (e.g. 'mô', 'tê', 'răng')..."
                    className="w-full px-6 py-4 rounded-full border-2 border-sand-200 shadow-sm focus:outline-none focus:border-terracotta-400 focus:ring-4 focus:ring-terracotta-100 transition-all font-serif text-lg placeholder:text-sand-300 bg-white"
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-2 bottom-2 bg-terracotta-600 hover:bg-terracotta-700 text-white px-6 rounded-full font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? '...' : 'Search'}
                </button>
            </form>
            
            {/* Quick Results Demo */}
            {results.length > 0 ? (
                <div className="mt-8 text-left max-w-xl mx-auto bg-white rounded-xl shadow-lg border border-sand-100 divide-y divide-sand-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                    {results.map((word: any) => (
                        <div key={word.id} className="p-4 hover:bg-sand-50 transition-colors cursor-default">
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-lg font-bold text-terracotta-700">{word.content}</h4>
                                <span className="text-xs font-medium uppercase tracking-wider text-sand-400 border border-sand-200 px-2 py-0.5 rounded-full">{word.dialectType}</span>
                            </div>
                            <p className="text-sand-600 text-sm">{word.definition}</p>
                            {word.usageExample && (
                                <p className="text-sand-400 text-xs mt-2 italic">"{word.usageExample}"</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : hasSearched && !loading ? (
                <div className="mt-8 text-center max-w-xl mx-auto p-8 bg-sand-50 rounded-xl border border-sand-200 border-dashed animate-in fade-in">
                    <p className="text-sand-500 font-serif italic">No words found for "{query}".</p>
                    <p className="text-sm text-sand-400 mt-1">Try searching for "Huế", "mô", or "răng".</p>
                </div>
            ) : null}
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Word of the Day */}
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-terracotta-200 flex-1"></div>
                <h2 className="font-serif text-2xl font-bold text-terracotta-800">Word of the Day</h2>
                <div className="h-px bg-terracotta-200 flex-1"></div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-sand-200 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-9xl text-terracotta-200 select-none group-hover:scale-110 transition-transform duration-700">“</div>
                <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-terracotta-100 text-terracotta-700 text-xs font-bold rounded-full mb-4">Central Dialect</span>
                    <h3 className="text-4xl font-serif font-bold text-gray-900 mb-2">Chí mô</h3>
                    <p className="text-lg text-sand-500 italic mb-6">/chiː mo/ • exclamation</p>
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                        Used to express "nowhere" or "nothing at all" in a dismissive or emphasizing way. Similar to "đâu có" in standard Vietnamese but with stronger regional flair.
                    </p>
                    <div className="bg-sand-50 p-4 rounded-lg border-l-4 border-terracotta-400">
                        <p className="text-sand-600 font-medium">"Mi đi mô rứa? Tau nỏ đi chí mô cả!"</p>
                        <p className="text-sand-400 text-sm mt-1">(Where are you going? I'm not going anywhere!)</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Map Section */}
        <div className="space-y-6">
             <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-sand-200 flex-1"></div>
                <h2 className="font-serif text-2xl font-bold text-sand-600">Region Map</h2>
                <div className="h-px bg-sand-200 flex-1"></div>
            </div>
            <MapPlaceholder />
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white rounded-xl border border-sand-200">
                    <div className="text-3xl font-serif font-bold text-terracotta-600 mb-1">1,240</div>
                    <div className="text-xs text-sand-400 font-medium uppercase tracking-widest">North</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-sand-200">
                    <div className="text-3xl font-serif font-bold text-terracotta-600 mb-1">3,892</div>
                    <div className="text-xs text-sand-400 font-medium uppercase tracking-widest">Central</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-sand-200">
                    <div className="text-3xl font-serif font-bold text-terracotta-600 mb-1">2,105</div>
                    <div className="text-xs text-sand-400 font-medium uppercase tracking-widest">South</div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
