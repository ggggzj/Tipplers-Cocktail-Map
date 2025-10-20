import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Search, Heart, Filter, AlertCircle, X } from 'lucide-react';
import { barAPI, withRetry, type APIError } from '../services/barAPI';
import type { Bar } from '../types/bar';
import { useAppStore } from '../store/AppStore';
import { isOpenNow } from '../utils/hours';
import MapView from '../components/MapView';

interface Toast {
  id: string;
  type: 'error' | 'success' | 'info';
  message: string;
  duration?: number;
}

const DiscoverPage: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: Toast['type'], message: string, duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, type, message, duration };

    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    const loadBars = async () => {
      try {
        setLoading(true);
        const barsData = await withRetry(() => barAPI.getBars());
        dispatch({ type: 'SET_BARS', payload: barsData });
        dispatch({ type: 'SET_FILTERED_BARS', payload: barsData });
        showToast('success', `Loaded ${barsData.length} bars from Los Angeles`, 3000);
      } catch (error) {
        console.error('Error loading bars:', error);
        const apiError = error as APIError;
        const message = apiError.retryable
          ? 'Failed to load bars after multiple attempts. Please refresh the page.'
          : 'Unable to load bars. Please check your connection and try again.';
        showToast('error', message);
      } finally {
        setLoading(false);
      }
    };

    loadBars();
  }, [dispatch]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      dispatch({ type: 'SET_FILTERED_BARS', payload: state.bars });
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filteredBars = state.bars.filter(bar =>
      bar.name.toLowerCase().includes(lowercaseQuery) ||
      bar.address.toLowerCase().includes(lowercaseQuery) ||
      bar.neighborhood.toLowerCase().includes(lowercaseQuery) ||
      bar.tags.cocktails.some(cocktail => cocktail.toLowerCase().includes(lowercaseQuery)) ||
      bar.tags.atmosphere.some(atmosphere => atmosphere.toLowerCase().includes(lowercaseQuery))
    );

    dispatch({ type: 'SET_FILTERED_BARS', payload: filteredBars });
  };

  const toggleFavorite = (barId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: barId });
  };

  const formatPriceRange = (level: number) => {
    return '$'.repeat(level);
  };

  const checkOpenStatus = (bar: Bar) => {
    return isOpenNow(bar);
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center p-4 max-w-sm card-editorial animate-fade-in-up ${
              toast.type === 'error'
                ? 'bg-red-50/90 border-red-200 text-red-800'
                : toast.type === 'success'
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
                : 'bg-blue-50/90 border-blue-200 text-blue-800'
            }`}
          >
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="flex-1 font-medium">{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="ml-3 flex-shrink-0 p-1 hover:bg-white/40 transition-colors duration-200"
              style={{ borderRadius: '2px' }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="bg-paper-surface/95 backdrop-blur-sm border-b sketch-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-3xl font-serif font-bold text-ink">
                Tipplers
              </h1>
              <span className="ml-4 tag-gold transform rotate-[-1deg]">
                Discover Great Bars
              </span>
            </div>
            <div className="text-sm font-medium text-ink-light">
              {state.filteredBars.length} bars • {state.favorites.length} favorites
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ink-lighter h-5 w-5" />
              <input
                type="text"
                placeholder="Search bars, cocktails, atmosphere..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 bg-paper-surface border-2 border-ink/20 text-ink placeholder-ink-lighter font-medium tracking-wide transition-all duration-300 focus:border-gold focus:shadow-subtle"
                style={{ borderRadius: '2px' }}
              />
            </div>
            <button
              onClick={handleSearch}
              className="btn-editorial"
            >
              Search
            </button>
            <button className="btn-secondary p-3">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Bar List */}
          <div className="lg:col-span-5">
            <div className="card-editorial overflow-hidden">
              <div className="p-6 border-b-2 border-ink/10">
                <h2 className="text-xl font-serif font-semibold text-ink">
                  {loading ? 'Loading...' : `${state.filteredBars.length} bars found`}
                </h2>
              </div>

              <div className="divide-y divide-ink/10 max-h-[calc(100vh-300px)] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-ink-light">
                    Loading bars...
                  </div>
                ) : state.filteredBars.length === 0 ? (
                  <div className="p-8 text-center text-ink-light">
                    No bars found. Try a different search.
                  </div>
                ) : (
                  state.filteredBars.map((bar) => (
                    <div
                      key={bar.id}
                      className={`p-6 hover:bg-paper-warm cursor-pointer transition-all duration-300 hover-shadow ${
                        selectedBar?.id === bar.id ? 'bg-gold/5 border-l-4 border-gold' : ''
                      }`}
                      onClick={() => setSelectedBar(bar)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <Link
                              to={`/bars/${bar.id}`}
                              className="text-xl font-serif font-semibold text-ink gold-underline truncate"
                            >
                              {bar.name}
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(bar.id);
                              }}
                              className="ml-2 p-1"
                            >
                              <Heart
                                className={`h-5 w-5 transition-colors ${
                                  state.favorites.includes(bar.id)
                                    ? 'fill-gold text-gold'
                                    : 'text-ink-lighter hover:text-gold'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center mt-2 text-sm text-ink-light">
                            <Star className="h-4 w-4 fill-gold text-gold mr-1" />
                            <span className="mr-4 font-medium">{bar.rating} ({bar.reviewCount})</span>
                            <span className="mr-4 font-bold text-gold">{formatPriceRange(bar.priceLevel)}</span>
                            <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                              checkOpenStatus(bar)
                                ? 'tag-gold'
                                : 'tag-gunmetal'
                            }`}>
                              {checkOpenStatus(bar) ? 'Open' : 'Closed'}
                            </span>
                          </div>

                          <div className="flex items-center mt-2 text-sm text-ink-light">
                            <MapPin className="h-4 w-4 mr-2 text-gold" />
                            <span className="truncate italic">{bar.address}</span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {bar.tags.cocktails.slice(0, 3).map((cocktail, index) => (
                              <span
                                key={index}
                                className="tag-gold"
                              >
                                {cocktail}
                              </span>
                            ))}
                            {bar.tags.atmosphere.slice(0, 2).map((atmosphere, index) => (
                              <span
                                key={index}
                                className="tag-gunmetal"
                              >
                                {atmosphere}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="lg:col-span-7">
            <div className="card-editorial overflow-hidden">
              <div className="h-[600px]">
                <MapView
                  bars={state.filteredBars}
                  selectedBar={selectedBar}
                  onBarSelect={setSelectedBar}
                  center={selectedBar ? [selectedBar.lat, selectedBar.lng] : [34.0522, -118.2437]}
                  zoom={selectedBar ? 14 : 11}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;