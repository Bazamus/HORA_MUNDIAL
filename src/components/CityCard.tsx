import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X, MapPin, Clock, ArrowUp, ArrowDown } from 'lucide-react';

interface CityCardProps {
  city: {
    name: string;
    timezone: string;
    image: string;
  };
  userTimezone: string;
  onRemove: (cityName: string) => void;
  darkMode: boolean;
}

const CityCard: React.FC<CityCardProps> = ({ city, userTimezone, onRemove, darkMode }) => {
  const [time, setTime] = useState(new Date());
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cityTime = new Date(time.toLocaleString('en-US', { timeZone: city.timezone }));
  const userTime = new Date(time.toLocaleString('en-US', { timeZone: userTimezone }));
  const timeDiff = Math.round((cityTime.getTime() - userTime.getTime()) / (1000 * 60 * 60));

  // Imagen de respaldo en caso de error
  const getFallbackImage = (timezone: string): string => {
    const region = timezone.split('/')[0].toLowerCase();
    
    if (region === 'europe') {
      return "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&q=80&w=400&h=200";
    } else if (region === 'america') {
      return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=400&h=200";
    } else if (region === 'asia') {
      return "https://images.unsplash.com/photo-1536599424071-0b215a388ba7?auto=format&fit=crop&q=80&w=400&h=200";
    } else if (region === 'africa') {
      return "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=400&h=200";
    } else if (region === 'australia' || region === 'pacific') {
      return "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=400&h=200";
    }
    
    return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=200";
  };

  // Traducir "ahead" y "behind" al español
  const getTimeDiffText = () => {
    if (timeDiff === 0) return "misma hora";
    return `${Math.abs(timeDiff)} hora${Math.abs(timeDiff) !== 1 ? 's' : ''} ${timeDiff > 0 ? 'por delante' : 'por detrás'}`;
  };

  // Obtener la región de la zona horaria
  const getRegion = (): string => {
    const parts = city.timezone.split('/');
    return parts[0];
  };

  const region = getRegion();

  return (
    <div 
      className={`relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-48 group city-card cursor-pointer`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <img
        src={imageError ? getFallbackImage(city.timezone) : city.image}
        alt={city.name}
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
      <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-t from-black/80 to-black/20' : 'bg-gradient-to-t from-black/70 to-black/10'} p-3`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(city.name);
          }}
          className="absolute top-2 right-2 p-1 hover:bg-black/30 rounded-full transition-colors opacity-70 hover:opacity-100 z-10"
        >
          <X className="w-3 h-3 text-white" />
        </button>
        
        <div className="absolute bottom-3 left-3 right-3">
          <h2 className="text-sm font-semibold text-white mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-blue-300" />
            {city.name}
          </h2>
          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-2xl font-mono font-bold text-blue-300 city-time">
              {format(cityTime, 'HH:mm')}
              <span className="text-sm">{format(cityTime, ':ss')}</span>
            </div>
            <div className="text-sm font-medium text-blue-300/90">
              {format(cityTime, 'a', { locale: es }).toUpperCase()}
            </div>
          </div>
          <div className="text-xs text-white/70">
            <p>{format(cityTime, 'EEEE, d MMM', { locale: es })}</p>
            <p className="flex items-center gap-1">
              {timeDiff !== 0 && (
                timeDiff > 0 ? 
                <ArrowUp className="w-3 h-3 text-green-400" /> : 
                <ArrowDown className="w-3 h-3 text-red-400" />
              )}
              {getTimeDiffText()}
            </p>
          </div>

          {showDetails && (
            <div className="absolute inset-0 bg-black/80 p-3 flex flex-col justify-center items-center text-center animate-fadeIn z-0">
              <Clock className="w-5 h-5 text-blue-300 mb-2" />
              <h3 className="text-white font-semibold mb-1">{city.name}</h3>
              <p className="text-sm text-white/80 mb-1">Región: {region}</p>
              <p className="text-sm text-white/80 mb-2">Zona: {city.timezone}</p>
              <div className="text-xl font-mono font-bold text-blue-300 mb-1">
                {format(cityTime, 'HH:mm:ss')}
              </div>
              <p className="text-xs text-white/70">
                {format(cityTime, 'EEEE, d MMMM yyyy', { locale: es })}
              </p>
              <p className="text-xs text-white/70 mt-2">
                {getTimeDiffText()} de tu zona horaria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityCard;