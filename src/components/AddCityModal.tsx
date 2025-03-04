import React, { useState, useEffect, useRef } from 'react';
import { X, Search, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { cityList } from '../cityList';

interface AddCityModalProps {
  onClose: () => void;
  onAdd: (city: { name: string; timezone: string; image: string }) => void;
  existingCities: { name: string; timezone: string; image: string }[];
  darkMode: boolean;
}

const AddCityModal: React.FC<AddCityModalProps> = ({ onClose, onAdd, existingCities, darkMode }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Enfocar el input cuando se abre el modal
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Cerrar el modal al hacer clic fuera de él
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Cerrar el modal al presionar Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const filteredCities = cityList
    .filter(city => 
      city.name.toLowerCase().includes(search.toLowerCase()) &&
      !existingCities.some(existingCity => existingCity.name === city.name)
    )
    .slice(0, 20); // Limitar a 20 resultados para mejor rendimiento

  // Imágenes predefinidas para diferentes regiones
  const getDefaultImage = (cityName: string, timezone: string): string => {
    const region = timezone.split('/')[0].toLowerCase();
    
    // Imágenes por región
    if (region === 'europe') {
      return 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&q=80&w=400&h=200';
    } else if (region === 'america') {
      return 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=400&h=200';
    } else if (region === 'asia') {
      return 'https://images.unsplash.com/photo-1536599424071-0b215a388ba7?auto=format&fit=crop&q=80&w=400&h=200';
    } else if (region === 'africa') {
      return 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=400&h=200';
    } else if (region === 'australia' || region === 'pacific') {
      return 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=400&h=200';
    }
    
    // Imagen genérica por defecto
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=200';
  };

  const handleAddCity = async (city: { name: string; timezone: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar imagen predefinida en lugar de intentar obtenerla de Unsplash
      const imageUrl = getDefaultImage(city.name, city.timezone);
      
      // Añadir la ciudad con la imagen obtenida
      onAdd({
        name: city.name,
        timezone: city.timezone,
        image: imageUrl,
      });
      
    } catch (err) {
      setError('Error al añadir la ciudad. Por favor, inténtalo de nuevo.');
      console.error('Error añadiendo ciudad:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div 
        ref={modalRef}
        className={`w-full max-w-md rounded-lg shadow-xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'} overflow-hidden`}
      >
        <div className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <h2 className="text-lg font-semibold">Añadir Ciudad</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <Search className={`absolute left-3 top-2.5 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ciudades..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none ${
                darkMode 
                  ? 'bg-slate-700/50 focus:ring-2 focus:ring-blue-500 placeholder-slate-400' 
                  : 'bg-slate-100 focus:ring-2 focus:ring-blue-400 placeholder-slate-500'
              }`}
            />
          </div>
          
          {error && (
            <div className={`p-3 mb-4 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'}`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className={`w-8 h-8 animate-spin ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className="ml-2">Cargando...</span>
            </div>
          ) : (
            <>
              {search && filteredCities.length === 0 ? (
                <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  <p>No se encontraron ciudades que coincidan con tu búsqueda.</p>
                  <p className="text-sm mt-2">Intenta con otro nombre o comprueba si la ciudad ya está en tu lista.</p>
                </div>
              ) : (
                <div className={`max-h-[300px] overflow-y-auto ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
                  {filteredCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleAddCity(city)}
                      className={`w-full text-left p-3 rounded-lg mb-2 flex items-center gap-2 transition-colors ${
                        darkMode 
                          ? 'hover:bg-slate-700' 
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <MapPin className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <div>
                        <div className="font-medium">{city.name}</div>
                        <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{city.timezone}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        
        <div className={`p-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'} flex justify-end`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg mr-2 ${
              darkMode 
                ? 'bg-slate-700 hover:bg-slate-600' 
                : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            } transition-colors`}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCityModal;