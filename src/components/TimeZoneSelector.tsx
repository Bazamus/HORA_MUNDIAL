import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Globe } from 'lucide-react';

// Lista de zonas horarias comunes
const commonTimezones = [
  'Europe/Madrid',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
  'America/Mexico_City',
  'America/Bogota',
  'America/Buenos_Aires',
  'America/Santiago',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland'
];

interface TimeZoneSelectorProps {
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
  darkMode: boolean;
}

const TimeZoneSelector: React.FC<TimeZoneSelectorProps> = ({ 
  selectedTimezone, 
  onTimezoneChange,
  darkMode
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAllTimezones, setShowAllTimezones] = useState(false);
  
  // Actualizar la hora cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Obtener todas las zonas horarias disponibles
  const allTimezones = Intl.supportedValuesOf('timeZone');
  
  // Ordenar las zonas horarias por continente/región
  const groupedTimezones = allTimezones.reduce((acc: Record<string, string[]>, timezone) => {
    const region = timezone.split('/')[0];
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(timezone);
    return acc;
  }, {});

  // Ordenar las regiones
  const sortedRegions = Object.keys(groupedTimezones).sort();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className="text-lg font-semibold">Configuración de Zona Horaria</h2>
      </div>
      
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} flex flex-col md:flex-row md:items-center gap-4`}>
        <div className="flex-1">
          <p className="text-sm mb-2">Tu zona horaria actual:</p>
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div className="font-mono text-xl">
              {format(currentTime, 'HH:mm:ss')}
            </div>
            <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {format(currentTime, 'EEEE, d MMMM yyyy', { locale: es })}
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <label htmlFor="timezone-select" className="text-sm mb-2 block">
            Selecciona tu zona horaria:
          </label>
          <select
            id="timezone-select"
            value={selectedTimezone}
            onChange={(e) => onTimezoneChange(e.target.value)}
            className={`w-full p-2 rounded-lg ${
              darkMode 
                ? 'bg-slate-800 border border-slate-600 focus:border-blue-500' 
                : 'bg-white border border-slate-300 focus:border-blue-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {!showAllTimezones ? (
              // Mostrar zonas horarias comunes
              commonTimezones.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone.replace('_', ' ')}
                </option>
              ))
            ) : (
              // Mostrar todas las zonas horarias agrupadas por región
              sortedRegions.map((region) => (
                <optgroup key={region} label={region}>
                  {groupedTimezones[region].map((timezone) => (
                    <option key={timezone} value={timezone}>
                      {timezone.replace('_', ' ')}
                    </option>
                  ))}
                </optgroup>
              ))
            )}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={() => setShowAllTimezones(!showAllTimezones)}
          className={`text-sm ${
            darkMode 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-blue-600 hover:text-blue-500'
          }`}
        >
          {showAllTimezones 
            ? 'Mostrar solo zonas horarias comunes' 
            : 'Mostrar todas las zonas horarias'}
        </button>
      </div>
    </div>
  );
};

export default TimeZoneSelector;