import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Clock, Phone, Globe, Heart } from 'lucide-react';
import { barAPI, withRetry } from '../services/barAPI';
import type { Bar } from '../types/bar';
import { useAppStore } from '../store/AppStore';
import { isOpenNow } from '../utils/hours';

const BarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bar, setBar] = useState<Bar | null>(null);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useAppStore();

  useEffect(() => {
    const loadBar = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const barData = await withRetry(() => barAPI.getBarById(id));
        setBar(barData);
      } catch (error) {
        console.error('Error loading bar:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBar();
  }, [id]);

  const toggleFavorite = () => {
    if (!bar) return;
    dispatch({ type: 'TOGGLE_FAVORITE', payload: bar.id });
  };

  const formatPriceRange = (level: number) => {
    return '$'.repeat(level);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bar details...</p>
        </div>
      </div>
    );
  }

  if (!bar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Bar not found</h1>
          <Link
            to="/"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Back to discover
          </Link>
        </div>
      </div>
    );
  }

  const isFavorite = state.favorites.includes(bar?.id || '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to discover
            </Link>
            <button
              onClick={toggleFavorite}
              className="flex items-center px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Heart
                className={`h-5 w-5 mr-2 ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
              {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          {bar.photos && bar.photos.length > 0 && (
            <div className="h-64 bg-gray-200 relative">
              <img
                src={bar.photos[0]}
                alt={bar.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{bar.name}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="mr-4">{bar.rating} ({bar.reviewCount})</span>
                  <span className="mr-4 text-green-600 font-medium">
                    {formatPriceRange(bar.priceLevel)}
                  </span>
                  <span className={`mr-4 px-2 py-1 rounded-full text-xs ${
                    isOpenNow(bar)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isOpenNow(bar) ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span>{bar.address}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              {bar.phone && (
                <a
                  href={`tel:${bar.phone}`}
                  className="flex items-center text-amber-600 hover:text-amber-700"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {bar.phone}
                </a>
              )}
              {bar.website && (
                <a
                  href={bar.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-amber-600 hover:text-amber-700"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  Website
                </a>
              )}
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {bar.tags.cocktails.map((cocktail, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full"
                  >
                    {cocktail}
                  </span>
                ))}
                {bar.tags.atmosphere.map((atmosphere, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                  >
                    {atmosphere}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Hours</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(bar.hours).map(([day, hours]) => (
              <div key={day} className="flex justify-between">
                <span className="font-medium text-gray-900">{day}</span>
                <span className={hours.length === 0 ? 'text-red-600' : 'text-gray-600'}>
                  {hours.length === 0 ? 'Closed' : `${hours[0].open} - ${hours[0].close}`}
                </span>
              </div>
            ))}
          </div>

          {bar.happyHour && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-1">Happy Hour</h4>
              <p className="text-sm text-amber-700">
                {bar.happyHour.days.join(', ')} • {bar.happyHour.start} - {bar.happyHour.end}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarDetailPage;