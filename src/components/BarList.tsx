import React from 'react';
import { Phone, Globe, MapPin, Star, Clock, Heart, Sparkles, Zap } from 'lucide-react';
import type { CocktailBar } from '../types';

interface BarListProps {
  bars: CocktailBar[];
  selectedBar: CocktailBar | null;
  onBarSelect: (bar: CocktailBar) => void;
  onToggleFavorite: (barId: string) => void;
  favoriteIds: string[];
  loading?: boolean;
}

const BarList: React.FC<BarListProps> = ({ 
  bars, 
  selectedBar, 
  onBarSelect, 
  onToggleFavorite,
  favoriteIds,
  loading = false
}) => {
  const formatPriceRange = (priceRange: number) => {
    return '$'.repeat(priceRange);
  };

  const isOpenNow = (hours: CocktailBar['openHours']): boolean => {
    const now = new Date();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const todayHours = hours[today];
    if (!todayHours || todayHours.closed) return false;
    
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    if (closeTime < openTime) {
      return currentTime >= openTime || currentTime <= closeTime;
    }
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const formatHours = (hours: CocktailBar['openHours']) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = hours[today];
    
    if (todayHours?.closed) {
      return 'Closed today';
    }
    
    if (todayHours) {
      return `${todayHours.open} - ${todayHours.close}`;
    }
    
    return 'Hours not available';
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="card-editorial p-8 animate-pulse">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-ink/10 w-3/4" style={{ borderRadius: '2px' }}></div>
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-ink/10 w-16" style={{ borderRadius: '2px' }}></div>
                  <div className="h-4 bg-ink/10 w-12" style={{ borderRadius: '2px' }}></div>
                  <div className="h-4 bg-ink/10 w-20" style={{ borderRadius: '2px' }}></div>
                </div>
                <div className="h-4 bg-ink/10 w-full" style={{ borderRadius: '2px' }}></div>
              </div>
              <div className="h-12 w-12 bg-ink/10 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className="h-6 bg-ink/10 w-20 rounded-full"></div>
                <div className="h-6 bg-ink/10 w-24 rounded-full"></div>
                <div className="h-6 bg-ink/10 w-16 rounded-full"></div>
              </div>
              <div className="flex space-x-3">
                <div className="h-6 bg-ink/10 w-16 rounded-full"></div>
                <div className="h-6 bg-ink/10 w-20 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bars.length === 0) {
    return (
      <div className="p-16 text-center card-editorial">
        <div className="w-40 h-40 mx-auto mb-8 border-2 border-gold/30 flex items-center justify-center shadow-editorial transform rotate-1 bg-gold/5" style={{ borderRadius: '4px' }}>
          <div className="space-x-3">
            <span className="text-4xl animate-bounce">🍸</span>
            <span className="text-4xl animate-bounce" style={{animationDelay: '0.2s'}}>🔍</span>
          </div>
        </div>
        <h3 className="text-4xl font-serif font-bold mb-6 text-ink">
          No bars found
        </h3>
        <p className="text-lg font-medium max-w-md mx-auto mb-10 text-ink-light leading-relaxed">
          We couldn't find any cocktail bars matching your criteria. Try adjusting your filters or search terms to discover new places.
        </p>
        <div className="flex justify-center space-x-8 mb-10">
          <div className="text-center">
            <span className="text-5xl animate-pulse">🍸</span>
            <p className="text-sm text-ink-lighter mt-3 font-medium uppercase tracking-wide">Martinis</p>
          </div>
          <div className="text-center">
            <span className="text-5xl animate-pulse" style={{animationDelay: '0.3s'}}>🍹</span>
            <p className="text-sm text-ink-lighter mt-3 font-medium uppercase tracking-wide">Cocktails</p>
          </div>
          <div className="text-center">
            <span className="text-5xl animate-pulse" style={{animationDelay: '0.6s'}}>🥃</span>
            <p className="text-sm text-ink-lighter mt-3 font-medium uppercase tracking-wide">Whiskey</p>
          </div>
          <div className="text-center">
            <span className="text-5xl animate-pulse" style={{animationDelay: '0.9s'}}>🍷</span>
            <p className="text-sm text-ink-lighter mt-3 font-medium uppercase tracking-wide">Wine</p>
          </div>
        </div>
        <div className="flex justify-center space-x-6">
          <Sparkles className="w-8 h-8 text-gold animate-pulse" />
          <Zap className="w-8 h-8 text-gunmetal animate-pulse" />
          <Sparkles className="w-8 h-8 text-gold animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {bars.map((bar) => (
        <div
          key={bar.id}
          onClick={() => onBarSelect(bar)}
          className={`group card-editorial p-8 cursor-pointer transition-all duration-300 hover-shadow ${
            selectedBar?.id === bar.id
              ? 'border-gold/40 shadow-luxury bg-gold/5'
              : 'hover:border-gold/20'
          }`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-2xl font-serif font-bold text-ink gold-underline group-hover:text-gold transition-colors">
                  {bar.name}
                </h3>
                <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wide ${
                  isOpenNow(bar.openHours)
                    ? 'tag-gold'
                    : 'tag-gunmetal'
                }`}>
                  {isOpenNow(bar.openHours) ? 'Open Now' : 'Closed'}
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-gold fill-current" />
                  <span className="font-bold text-ink text-lg">{bar.rating}</span>
                </div>
                <div className="w-1.5 h-1.5 bg-ink/20 rounded-full"></div>
                <span className="font-bold text-gold text-xl">{formatPriceRange(bar.priceRange)}</span>
                <div className="w-1.5 h-1.5 bg-ink/20 rounded-full"></div>
                <div className="flex items-center space-x-2 text-ink-light">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{formatHours(bar.openHours)}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-ink-light mb-6">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-gold" />
                <span className="leading-relaxed italic text-base">{bar.address}</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(bar.id);
              }}
              className="p-4 hover:bg-gold/10 transition-all duration-300 hover:scale-110" style={{ borderRadius: '4px' }}
            >
              <Heart
                className={`w-7 h-7 transition-all ${
                  favoriteIds.includes(bar.id)
                    ? 'text-gold fill-current scale-110'
                    : 'text-ink-lighter group-hover:text-gold'
                }`}
              />
            </button>
          </div>

          {bar.description && (
            <div className="bg-paper-warm p-6 border-l-4 border-gold mb-6" style={{ borderRadius: '2px' }}>
              <p className="text-ink-light leading-relaxed italic text-base">{bar.description}</p>
            </div>
          )}

          <div className="space-y-5 mb-6">
            <div>
              <p className="text-xs font-bold text-ink-lighter mb-3 uppercase tracking-widest">Cocktail Specialties</p>
              <div className="flex flex-wrap gap-3">
                {bar.cocktailTypes.slice(0, 4).map((cocktail, index) => (
                  <span
                    key={index}
                    className="tag-gold"
                  >
                    {cocktail.name}
                  </span>
                ))}
                {bar.cocktailTypes.length > 4 && (
                  <span className="tag-gunmetal">
                    +{bar.cocktailTypes.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-ink-lighter mb-3 uppercase tracking-widest">Atmosphere</p>
              <div className="flex flex-wrap gap-3">
                {bar.atmosphere.slice(0, 3).map((mood, index) => (
                  <span
                    key={index}
                    className="tag-gunmetal"
                  >
                    {mood}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t-2 border-ink/10">
            <div className="flex space-x-4">
              {bar.phoneNumber && (
                <a
                  href={`tel:${bar.phoneNumber}`}
                  onClick={(e) => e.stopPropagation()}
                  className="btn-editorial inline-flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
              )}
              {bar.website && (
                <a
                  href={bar.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
            </div>
            <div className="tag-gunmetal">
              {bar.reviews.length} review{bar.reviews.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarList;