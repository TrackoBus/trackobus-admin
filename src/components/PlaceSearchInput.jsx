import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Navigation, Copy, Check, Crosshair, Edit3 } from 'lucide-react';
import { searchPlaces } from '../services/placeSearch';

/**
 * PlaceSearchInput Component
 * Provides real-time Google Maps & OSM place search with autocomplete,
 * lat/lng coordinate extraction, map focusing, and manual coordinate fine-tuning.
 */
const PlaceSearchInput = ({
  label,
  placeholder = 'Search place or enter city/bus stand...',
  value = { name: '', lat: null, lng: null, address: '' },
  onChange,
  onFocusMap,
  accentColor = 'blue', // 'emerald' | 'rose' | 'blue' | 'indigo'
  required = false,
  helperText,
}) => {
  const [query, setQuery] = useState(value?.name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [manualLat, setManualLat] = useState(value?.lat ?? '');
  const [manualLng, setManualLng] = useState(value?.lng ?? '');

  const wrapperRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const prevValueNameRef = useRef(value?.name);

  // Sync internal query only when prop value.name changes externally
  useEffect(() => {
    if (value?.name !== prevValueNameRef.current) {
      prevValueNameRef.current = value?.name;
      setQuery(value?.name || '');
    }
  }, [value?.name]);

  useEffect(() => {
    setManualLat(value?.lat ?? '');
    setManualLng(value?.lng ?? '');
  }, [value?.lat, value?.lng]);

  // Click outside listener to close suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search handler
  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);
    prevValueNameRef.current = text;

    if (onChange) {
      onChange({
        name: text,
        address: value?.address || text,
        lat: text ? value?.lat : null,
        lng: text ? value?.lng : null,
      });
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!text || text.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchPlaces(text);
        setSuggestions(results || []);
      } catch (err) {
        console.error('Place search error:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleSelectPlace = (place) => {
    setQuery(place.name);
    prevValueNameRef.current = place.name;
    setIsOpen(false);
    setSuggestions([]);
    setIsManualEdit(false);

    if (onChange) {
      onChange({
        name: place.name,
        address: place.address || place.name,
        lat: place.lat,
        lng: place.lng,
      });
    }

    if (onFocusMap && place.lat && place.lng) {
      onFocusMap(place.lat, place.lng);
    }
  };

  const handleClear = () => {
    setQuery('');
    prevValueNameRef.current = '';
    setSuggestions([]);
    setIsOpen(false);
    setIsManualEdit(false);
    if (onChange) {
      onChange({ name: '', lat: null, lng: null, address: '' });
    }
  };

  const handleCopyCoords = () => {
    if (value?.lat && value?.lng) {
      navigator.clipboard.writeText(`${value.lat}, ${value.lng}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApplyManualCoords = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      if (onChange) {
        onChange({
          ...value,
          name: query || `Point (${lat}, ${lng})`,
          lat,
          lng,
        });
      }
      if (onFocusMap) {
        onFocusMap(lat, lng);
      }
    }
    setIsManualEdit(false);
  };

  // Color classes mapping
  const colorMap = {
    emerald: {
      borderFocus: 'focus:border-emerald-500 focus:ring-emerald-500/20',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pinBg: 'bg-emerald-500 text-white',
      accentText: 'text-emerald-600',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700',
    },
    rose: {
      borderFocus: 'focus:border-rose-500 focus:ring-rose-500/20',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      pinBg: 'bg-rose-500 text-white',
      accentText: 'text-rose-600',
      btnBg: 'bg-rose-600 hover:bg-rose-700',
    },
    indigo: {
      borderFocus: 'focus:border-indigo-500 focus:ring-indigo-500/20',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      pinBg: 'bg-indigo-500 text-white',
      accentText: 'text-indigo-600',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700',
    },
    blue: {
      borderFocus: 'focus:border-blue-500 focus:ring-blue-500/20',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      pinBg: 'bg-blue-600 text-white',
      accentText: 'text-blue-600',
      btnBg: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const theme = colorMap[accentColor] || colorMap.blue;
  const hasCoordinates = value?.lat !== null && value?.lat !== undefined && value?.lng !== null && value?.lng !== undefined;

  return (
    <div className="relative space-y-1.5" ref={wrapperRef}>
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          {hasCoordinates && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${theme.badgeBg}`}>
              GPS Confirmed
            </span>
          )}
        </div>
      )}

      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none text-slate-400">
          <Search size={16} />
        </div>

        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          className={`w-full pl-10 pr-20 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:ring-4 ${theme.borderFocus}`}
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <Loader2 size={16} className="text-blue-500 animate-spin mr-1" />
          )}

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}

          {hasCoordinates && (
            <button
              type="button"
              onClick={() => onFocusMap && onFocusMap(value.lat, value.lng)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Focus on map"
            >
              <Crosshair size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto animate-in fade-in-50 slide-in-from-top-2 duration-150">
          <div className="p-2 border-b border-slate-100 bg-slate-50/70 flex justify-between items-center text-[11px] font-semibold text-slate-500 px-3">
            <span>Places & Google Map Locations</span>
            <span>{suggestions.length} found</span>
          </div>

          {suggestions.length === 0 && !isLoading ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No matching places found. Try typing a city, bus terminal, or landmark.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectPlace(item)}
                    className="w-full text-left p-3 hover:bg-blue-50/60 transition-colors flex items-start gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 flex items-center justify-center flex-shrink-0 transition-colors mt-0.5">
                      <MapPin size={16} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                          {item.name}
                        </p>
                        {item.lat && item.lng && (
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50/70 group-hover:text-blue-700 whitespace-nowrap">
                            {item.lat.toFixed(4)}, {item.lng.toFixed(4)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 font-normal">
                        {item.address}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Selected Coordinates Card */}
      {hasCoordinates && (
        <div className="mt-2 p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${theme.pinBg}`}></div>
              <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">
                {value.name || 'Selected Point'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyCoords}
                className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 transition-colors shadow-xs"
                title="Copy coordinates"
              >
                {copied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <button
                type="button"
                onClick={() => setIsManualEdit(!isManualEdit)}
                className="p-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-colors shadow-xs"
                title="Edit coordinates manually"
              >
                <Edit3 size={12} />
              </button>
            </div>
          </div>

          {/* Lat & Lng badges */}
          {!isManualEdit ? (
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70 flex justify-between items-center font-mono">
                <span className="text-slate-400 text-[10px] font-sans font-bold">LAT</span>
                <span className="font-semibold text-slate-800">{Number(value.lat).toFixed(5)}</span>
              </div>
              <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/70 flex justify-between items-center font-mono">
                <span className="text-slate-400 text-[10px] font-sans font-bold">LNG</span>
                <span className="font-semibold text-slate-800">{Number(value.lng).toFixed(5)}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 pt-1 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualEdit(false)}
                  className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-200/60 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyManualCoords}
                  className="px-3 py-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Save Coords
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {helperText && !hasCoordinates && (
        <p className="text-[10px] text-slate-400 pl-1">{helperText}</p>
      )}
    </div>
  );
};

export default PlaceSearchInput;
