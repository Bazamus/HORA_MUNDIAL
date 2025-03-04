import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon, Plus, Heart, Search, Moon, Sun, MapPin, Globe, Info } from 'lucide-react';
import { defaultCities } from './cities';
import CityCard from './components/CityCard';
import AddCityModal from './components/AddCityModal';
import TimeZoneSelector from './components/TimeZoneSelector';

// Definir la interfaz para el objeto ciudad
interface City {
  name: string;
  timezone: string;
  image: string;
}

function App() {
  // Recuperar el modo oscuro del localStorage si existe
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  const [userTimezone, setUserTimezone] = useState(() => {
    try {
      // Intentar obtener la zona horaria del usuario desde localStorage
      const savedTimezone = localStorage.getItem('userTimezone');
      return savedTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      // Si hay algún error, usar la zona horaria del sistema
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showAddCity, setShowAddCity] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [cities, setCities] = useState<City[]>(() => {
    // Intentar recuperar las ciudades guardadas del localStorage
    const savedCities = localStorage.getItem('savedCities');
    return savedCities ? JSON.parse(savedCities) : defaultCities;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(savedDarkMode);

  // Guardar las ciudades en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('savedCities', JSON.stringify(cities));
  }, [cities]);

  // Guardar el modo oscuro en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const addCity = (city: City) => {
    // Verificar si la ciudad ya existe
    if (!cities.some(c => c.name === city.name)) {
      setCities([...cities, city]);
    }
    setShowAddCity(false);
  };

  const removeCity = (cityName: string) => {
    setCities(cities.filter(city => city.name !== cityName));
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white' : 'bg-gradient-to-br from-blue-50 to-white text-slate-800'} p-4 transition-colors duration-300`}>
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <ClockIcon className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h1 className="text-2xl font-bold">Hora Mundial</h1>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
            >
              <Info className="w-4 h-4" />
              Info
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
            </button>
            <button
              onClick={() => setShowAddCity(true)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              <Plus className="w-4 h-4" />
              Añadir Ciudad
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
            >
              <Globe className="w-4 h-4 inline mr-1" />
              Configuración
            </button>
          </div>
        </div>

        {showInfo && (
          <div className={`mb-6 p-4 rounded-lg shadow-xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Acerca de Hora Mundial
            </h2>
            <p className="mb-2">
              Esta aplicación te permite ver la hora actual en diferentes ciudades del mundo. Puedes añadir nuevas ciudades, eliminar las que no necesites y buscar ciudades específicas.
            </p>
            <p className="mb-2">
              También puedes cambiar tu zona horaria para ver la diferencia horaria entre tu ubicación y las ciudades seleccionadas.
            </p>
            <p>
              Usa el botón <span className="font-semibold">Añadir Ciudad</span> para agregar nuevas ciudades a tu lista.
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className={`mt-4 px-3 py-1.5 text-sm rounded-lg transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'}`}
            >
              Cerrar
            </button>
          </div>
        )}

        {showSettings && (
          <div className={`mb-6 p-4 rounded-lg shadow-xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <TimeZoneSelector
              selectedTimezone={userTimezone}
              onTimezoneChange={setUserTimezone}
              darkMode={darkMode}
            />
          </div>
        )}

        <div className="relative mb-4">
          <Search className={`absolute left-3 top-2.5 w-5 h-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ciudades..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none ${
              darkMode 
                ? 'bg-slate-700/50 focus:ring-2 focus:ring-blue-500 placeholder-slate-400' 
                : 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-400 placeholder-slate-500'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredCities.map((city) => (
            <CityCard
              key={city.name}
              city={city}
              userTimezone={userTimezone}
              onRemove={removeCity}
              darkMode={darkMode}
            />
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <p>No se encontraron ciudades que coincidan con tu búsqueda.</p>
            <button
              onClick={() => setShowAddCity(true)}
              className={`mt-4 flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors mx-auto ${darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              <Plus className="w-4 h-4" />
              Añadir Ciudad
            </button>
          </div>
        )}

        {showAddCity && (
          <AddCityModal
            onClose={() => setShowAddCity(false)}
            onAdd={addCity}
            existingCities={cities}
            darkMode={darkMode}
          />
        )}

        <footer className={`mt-8 text-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <p className="flex items-center justify-center gap-1 flex-wrap">
            Hecho con <Heart className="w-4 h-4 text-red-400 fill-red-400" /> por{' '}
            <a 
              href="https://www.davidreya.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              David Rey
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;