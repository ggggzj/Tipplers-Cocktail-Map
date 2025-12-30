import React from 'react';
import { Filter, Star, Clock, DollarSign } from 'lucide-react';
import type { FilterOptions } from '../types';
import { cocktailTypes, atmosphereOptions } from '../data/sampleData';

interface SearchAndFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ filters, onFiltersChange }) => {

  const handlePriceRangeChange = (range: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: range
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating
    });
  };

  const handleCocktailTypeToggle = (cocktailType: string) => {
    const newTypes = filters.cocktailTypes.includes(cocktailType)
      ? filters.cocktailTypes.filter(t => t !== cocktailType)
      : [...filters.cocktailTypes, cocktailType];
    
    onFiltersChange({
      ...filters,
      cocktailTypes: newTypes
    });
  };

  const handleAtmosphereToggle = (atmosphere: string) => {
    const newAtmosphere = filters.atmosphere.includes(atmosphere)
      ? filters.atmosphere.filter(a => a !== atmosphere)
      : [...filters.atmosphere, atmosphere];
    
    onFiltersChange({
      ...filters,
      atmosphere: newAtmosphere
    });
  };

  const handleOpenNowToggle = () => {
    onFiltersChange({
      ...filters,
      isOpen: !filters.isOpen
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      priceRange: [],
      rating: 0,
      cocktailTypes: [],
      atmosphere: [],
      isOpen: false,
      location: null
    });
  };

  const getPriceDisplay = (value: number) => '$'.repeat(value);

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </h3>
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Price Range */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
          <label className="flex items-center space-x-3 text-lg font-bold text-gray-800 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span>💰 Price Range</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((price) => (
              <button
                key={price}
                onClick={() => {
                  const newRange = filters.priceRange.includes(price)
                    ? filters.priceRange.filter(p => p !== price)
                    : [...filters.priceRange, price];
                  handlePriceRangeChange(newRange);
                }}
                className={`px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${
                  filters.priceRange.includes(price)
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg border-2 border-white/50'
                    : 'bg-white/80 text-gray-700 hover:bg-green-100 border border-green-200'
                }`}
              >
                {getPriceDisplay(price)}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
          <label className="flex items-center space-x-3 text-lg font-bold text-gray-800 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span>⭐ Minimum Rating</span>
          </label>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating === filters.rating ? 0 : rating)}
                className={`w-10 h-10 text-2xl transition-all duration-200 transform hover:scale-110 rounded-full flex items-center justify-center ${
                  rating <= filters.rating
                    ? 'text-yellow-400 bg-yellow-100 shadow-lg'
                    : 'text-gray-300 hover:text-yellow-300 hover:bg-yellow-50'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <div className="text-center mt-3">
            <span className="text-sm font-medium text-gray-600">
              {filters.rating > 0 ? `${filters.rating}+ stars` : 'Any rating'}
            </span>
          </div>
        </div>

        {/* Open Now */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
          <label className="flex items-center space-x-3 text-lg font-bold text-gray-800 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span>🕐 Availability</span>
          </label>
          <label className="flex items-center justify-center space-x-4 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={filters.isOpen}
                onChange={handleOpenNowToggle}
                className="sr-only"
              />
              <div className={`w-16 h-8 rounded-full transition-all duration-300 ${
                filters.isOpen
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg'
                  : 'bg-gray-300'
              }`}>
                <div className={`absolute top-0.5 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  filters.isOpen ? 'translate-x-8' : 'translate-x-0.5'
                }`}></div>
              </div>
            </div>
            <span className={`font-bold text-base ${
              filters.isOpen ? 'text-green-600' : 'text-gray-600'
            }`}>
              {filters.isOpen ? '✅ Open Now Only' : '⏰ Show All'}
            </span>
          </label>
        </div>
      </div>

      {/* Cocktail Types */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mt-6">
        <label className="flex items-center space-x-3 text-lg font-bold text-gray-800 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">🍸</span>
          </div>
          <span>🍹 Cocktail Specialties</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cocktailTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleCocktailTypeToggle(type)}
              className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 text-center ${
                filters.cocktailTypes.includes(type)
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-2 border-white/50'
                  : 'bg-white/80 text-gray-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        {filters.cocktailTypes.length > 0 && (
          <div className="mt-4 text-center">
            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              {filters.cocktailTypes.length} selected
            </span>
          </div>
        )}
      </div>

      {/* Atmosphere */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg mt-6">
        <label className="flex items-center space-x-3 text-lg font-bold text-gray-800 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">✨</span>
          </div>
          <span>🎭 Atmosphere & Vibe</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {atmosphereOptions.map((atmosphere) => (
            <button
              key={atmosphere}
              onClick={() => handleAtmosphereToggle(atmosphere)}
              className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 text-center ${
                filters.atmosphere.includes(atmosphere)
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg border-2 border-white/50'
                  : 'bg-white/80 text-gray-700 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              {atmosphere}
            </button>
          ))}
        </div>
        {filters.atmosphere.length > 0 && (
          <div className="mt-4 text-center">
            <span className="text-sm font-medium text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
              {filters.atmosphere.length} selected
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;