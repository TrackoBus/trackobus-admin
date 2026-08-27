import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, X, Plus, Trash2, Navigation, Layers, Compass, 
  CheckCircle2, ArrowRight, Eye, RefreshCw, Sparkles, 
  Share2, Maximize2, Hash, FileText, Check, Copy, HelpCircle, Move, Loader2
} from 'lucide-react';
import PlaceSearchInput from '../components/PlaceSearchInput';
import { reverseGeocode } from '../services/placeSearch';
import { createRouteApi } from '../services/api';

// Fix default leaflet marker icon asset paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// --- Custom Styled Map Markers ---
const createCustomMarkerIcon = (text, bgColor, borderColor = '#ffffff', textColor = '#ffffff') => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${bgColor}; 
        color: ${textColor}; 
        min-width: 28px; 
        height: 28px; 
        padding: 0 6px;
        border-radius: 14px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 11px; 
        font-weight: 800; 
        border: 2.5px solid ${borderColor}; 
        box-shadow: 0 3px 8px rgba(0,0,0,0.35);
        transform: translate(-50%, -50%);
        white-space: nowrap;
      ">
        ${text}
      </div>
    `,
    className: 'custom-map-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// Map helper to trigger pan / zoom or fit bounds
function MapController({ focusTarget }) {
  const map = useMap();

  useEffect(() => {
    if (focusTarget && focusTarget.lat && focusTarget.lng) {
      map.flyTo([focusTarget.lat, focusTarget.lng], 14, { duration: 1.2 });
    }
  }, [focusTarget, map]);

  return null;
}

// Map Click Listener
function MapClickHandler({ onMapClick, isClickToAddEnabled }) {
  useMapEvents({
    click(e) {
      if (isClickToAddEnabled) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

// Calculate distance between two coordinates in km (Haversine formula)
const calculateDistanceKm = (coord1, coord2) => {
  if (!coord1 || !coord2) return 0;
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Addroute = ({ onSave, onClose }) => {
  // Tab Navigation: 'origin' | 'destination' | 'waypoints' | 'overview'
  const [activeTab, setActiveTab] = useState('origin');

  // Form Fields
  const [routeNumber, setRouteNumber] = useState('');
  const [routeName, setRouteName] = useState('');
  const [isManualRouteName, setIsManualRouteName] = useState(false);
  const [status, setStatus] = useState('Active');

  // Locations with { name, lat, lng, address }
  const [origin, setOrigin] = useState({ name: '', lat: null, lng: null, address: '' });
  const [destination, setDestination] = useState({ name: '', lat: null, lng: null, address: '' });
  const [waypoints, setWaypoints] = useState([]);

  // Search input for adding new waypoint
  const [waypointSearch, setWaypointSearch] = useState({ name: '', lat: null, lng: null, address: '' });
  const [isClickToAddEnabled, setIsClickToAddEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Map focus target
  const [focusTarget, setFocusTarget] = useState(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const mapRef = useRef(null);

  // Handlers for Origin and Destination that auto-suggest Route Name as "Origin - Destination"
  const handleOriginChange = (newVal) => {
    setOrigin(newVal);
    if (!isManualRouteName) {
      if (newVal?.name && destination?.name) {
        setRouteName(`${newVal.name} - ${destination.name}`);
      } else if (newVal?.name) {
        setRouteName(newVal.name);
      }
    }
  };

  const handleDestinationChange = (newVal) => {
    setDestination(newVal);
    if (!isManualRouteName) {
      if (origin?.name && newVal?.name) {
        setRouteName(`${origin.name} - ${newVal.name}`);
      } else if (newVal?.name) {
        setRouteName(newVal.name);
      }
    }
  };

  // Handle focus on map
  const handleFocusLocation = (lat, lng) => {
    if (lat && lng) {
      setFocusTarget({ lat, lng, timestamp: Date.now() });
    }
  };

  // Add waypoint from search input
  const handleAddSearchedWaypoint = () => {
    if (!waypointSearch.name && !waypointSearch.lat) return;

    const newWp = {
      id: `wp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: waypointSearch.name || `Waypoint ${waypoints.length + 1}`,
      address: waypointSearch.address || '',
      lat: waypointSearch.lat,
      lng: waypointSearch.lng,
    };

    setWaypoints((prev) => [...prev, newWp]);
    setWaypointSearch({ name: '', lat: null, lng: null, address: '' });
    if (newWp.lat && newWp.lng) {
      handleFocusLocation(newWp.lat, newWp.lng);
    }
  };

  // Handle map click to add waypoint
  const handleMapClick = async (latlng) => {
    const lat = parseFloat(latlng.lat.toFixed(6));
    const lng = parseFloat(latlng.lng.toFixed(6));

    // Reverse geocode to get a nice name
    const geo = await reverseGeocode(lat, lng);
    const newWp = {
      id: `wp-${Date.now()}`,
      name: geo.name || `Waypoint ${waypoints.length + 1}`,
      address: geo.address || `${lat}, ${lng}`,
      lat,
      lng,
    };

    // If Origin is not set, set as Origin
    if (!origin.lat || !origin.lng) {
      setOrigin({ name: geo.name, address: geo.address, lat, lng });
      setActiveTab('destination');
      return;
    }

    // If Destination is not set, set as Destination
    if (!destination.lat || !destination.lng) {
      setDestination({ name: geo.name, address: geo.address, lat, lng });
      setActiveTab('waypoints');
      return;
    }

    // Otherwise add as Waypoint
    setWaypoints((prev) => [...prev, newWp]);
  };

  const handleRemoveWaypoint = (indexToRemove) => {
    setWaypoints((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleMoveWaypoint = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= waypoints.length) return;
    const updated = [...waypoints];
    const item = updated.splice(index, 1)[0];
    updated.splice(targetIndex, 0, item);
    setWaypoints(updated);
  };

  // Compile all ordered route coordinates for Polyline & Bounds: Origin -> Waypoints -> Destination
  const allRoutePoints = [
    origin.lat && origin.lng ? { type: 'origin', name: origin.name || 'Origin', lat: origin.lat, lng: origin.lng } : null,
    ...waypoints
      .filter((w) => w.lat && w.lng)
      .map((w, i) => ({ type: 'waypoint', index: i + 1, name: w.name, lat: w.lat, lng: w.lng })),
    destination.lat && destination.lng
      ? { type: 'destination', name: destination.name || 'Destination', lat: destination.lat, lng: destination.lng }
      : null,
  ].filter(Boolean);

  const polylinePositions = allRoutePoints.map((p) => [p.lat, p.lng]);

  // Calculate approximate total route distance
  let totalDistanceKm = 0;
  for (let i = 0; i < allRoutePoints.length - 1; i++) {
    totalDistanceKm += calculateDistanceKm(allRoutePoints[i], allRoutePoints[i + 1]);
  }

  // Fit bounds to show all markers
  const handleFitRouteBounds = () => {
    if (mapRef.current && polylinePositions.length > 0) {
      const bounds = L.latLngBounds(polylinePositions);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  // Submission handler
  const submitNewRoute = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!routeNumber.trim()) {
      alert('Please enter a Route Number (e.g. 138)');
      setActiveTab('overview');
      return;
    }

    const finalRouteName = (
      routeName ||
      (origin.name && destination.name ? `${origin.name} - ${destination.name}` : origin.name || '')
    ).trim();

    if (!finalRouteName) {
      alert('Please enter a Route Name');
      setActiveTab('overview');
      return;
    }

    if (!origin.name && !origin.lat) {
      alert('Please select an Origin place or search on the Origin tab!');
      setActiveTab('origin');
      return;
    }

    if (!destination.name && !destination.lat) {
      alert('Please select a Destination place or search on the Destination tab!');
      setActiveTab('destination');
      return;
    }

    // Helper to format location into a String ("latitude,longitude" or address name)
    const formatToCoordString = (loc) => {
      if (!loc) return '';
      if (typeof loc === 'string') return loc.trim();
      if (loc.lat !== null && loc.lat !== undefined && loc.lng !== null && loc.lng !== undefined) {
        return `${loc.lat},${loc.lng}`;
      }
      return loc.name || '';
    };

    const originString = formatToCoordString(origin);
    const destString = formatToCoordString(destination);

    // Array of Strings ("latitude,longitude" or address names)
    const waypointStrings = waypoints
      .map((w) => formatToCoordString(w))
      .filter((s) => s && s.trim().length > 0);

    // Exact backend payload format
    const payload = {
      routeNumber: routeNumber.trim(),
      routeName: finalRouteName,
      origin: originString,
      destination: destString,
      waypoints: waypointStrings,
    };

    setIsSubmitting(true);
    setApiError('');

    try {
      // Send route data to backend database
      const savedData = await createRouteApi(payload);
      
      alert('Route successfully saved to backend database!');
      if (onSave) onSave({ ...(savedData || {}), ...payload, originName: origin.name, destinationName: destination.name, status, totalDistanceKm });
      if (onClose) onClose();
    } catch (error) {
      console.warn('Backend save error:', error);
      const confirmLocal = window.confirm(
        `Backend server message: "${error.message || 'Could not connect to backend'}"\n\nDo you want to save this route in your current session anyway?`
      );
      if (confirmLocal) {
        if (onSave) onSave(payload);
        if (onClose) onClose();
      } else {
        setApiError(error.message || 'Failed to send route to backend.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyJson = () => {
    const originStr = origin.lat && origin.lng ? `${origin.lat},${origin.lng}` : (origin.name || '');
    const destStr = destination.lat && destination.lng ? `${destination.lat},${destination.lng}` : (destination.name || '');
    const wpList = waypoints.map(w => (w.lat && w.lng ? `${w.lat},${w.lng}` : (typeof w === 'string' ? w : w.name || '')));

    const jsonStr = JSON.stringify(
      {
        routeNumber,
        routeName,
        status,
        origin: originStr,
        originName: origin.name,
        destination: destStr,
        destinationName: destination.name,
        waypoints: wpList,
        totalDistanceKm: parseFloat(totalDistanceKm.toFixed(2)),
      },
      null,
      2
    );
    navigator.clipboard.writeText(jsonStr);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[92vh] max-h-[850px] border border-slate-100">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-xs">
              <MapPin size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Add New Route</h2>
              <p className="text-xs text-slate-400 font-medium">
                Search Google Map locations & configure route waypoints with GPS coordinates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Panel: Tabs & Form */}
          <div className="w-full md:w-[420px] border-r border-slate-100 flex flex-col bg-white overflow-hidden flex-shrink-0">
            
            {/* Tabs Header */}
            <div className="px-6 pt-4 pb-2 border-b border-slate-100 bg-slate-50/50">
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/60 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('origin')}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                    activeTab === 'origin'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Origin
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('destination')}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                    activeTab === 'destination'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Destination
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('waypoints')}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                    activeTab === 'waypoints'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Waypoints ({waypoints.length})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                    activeTab === 'overview'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <FileText size={12} />
                    Overview
                  </span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: ORIGIN */}
              {activeTab === 'origin' && (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
                      <h3 className="font-bold text-slate-800 text-sm">Origin (Start Location)</h3>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      Step 1
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Search a starting bus terminal, junction, or city. We will extract the exact Google Map GPS coordinates.
                  </p>

                  <PlaceSearchInput
                    label="Search Origin Place *"
                    placeholder="e.g. Pettah Bus Stand, Colombo Fort..."
                    value={origin}
                    onChange={handleOriginChange}
                    onFocusMap={handleFocusLocation}
                    accentColor="emerald"
                    required
                    helperText="Type place name or click anywhere on the map to set origin"
                  />

                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/70 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                      <Compass size={16} /> Quick Origin Tips
                    </div>
                    <ul className="text-[11px] text-emerald-700 space-y-1">
                      <li>• Type e.g. <span className="font-bold">"Pettah"</span> or <span className="font-bold">"Fort Station"</span></li>
                      <li>• Or click on the map to auto-fill GPS coordinates</li>
                    </ul>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTab('destination')}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                    >
                      Next: Destination <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: DESTINATION */}
              {activeTab === 'destination' && (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-100"></div>
                      <h3 className="font-bold text-slate-800 text-sm">Destination (End Location)</h3>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                      Step 2
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Search the destination bus stop or terminal to set the endpoint of the route.
                  </p>

                  <PlaceSearchInput
                    label="Search Destination Place *"
                    placeholder="e.g. Homagama Town, Kandy Clock Tower..."
                    value={destination}
                    onChange={handleDestinationChange}
                    onFocusMap={handleFocusLocation}
                    accentColor="rose"
                    required
                    helperText="Type place name or click anywhere on the map to set destination"
                  />

                  <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100/70 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                      <Navigation size={16} /> Route Preview
                    </div>
                    <p className="text-[11px] text-rose-700">
                      {origin.name ? (
                        <span>From: <strong className="text-slate-900">{origin.name}</strong> ➔ To: <strong className="text-slate-900">{destination.name || 'Not selected'}</strong></span>
                      ) : (
                        'Please configure Origin in Step 1 for complete route preview'
                      )}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('origin')}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      ← Back to Origin
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('waypoints')}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                    >
                      Next: Waypoints <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: WAYPOINTS */}
              {activeTab === 'waypoints' && (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                      <h3 className="font-bold text-slate-800 text-sm">Route Waypoints & Stops</h3>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {waypoints.length} stops
                    </span>
                  </div>

                  {/* Add Waypoint Search */}
                  <div className="space-y-2">
                    <PlaceSearchInput
                      label="Search Waypoint to Add"
                      placeholder="Search bus stop, junction (e.g. Nugegoda)..."
                      value={waypointSearch}
                      onChange={(newVal) => setWaypointSearch(newVal)}
                      onFocusMap={handleFocusLocation}
                      accentColor="blue"
                    />

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleAddSearchedWaypoint}
                        disabled={!waypointSearch.name && !waypointSearch.lat}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <Plus size={15} /> Add Waypoint Stop
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsClickToAddEnabled(!isClickToAddEnabled)}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isClickToAddEnabled
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                        title="Toggle map click to add waypoints"
                      >
                        <MapPin size={14} /> Map Click: {isClickToAddEnabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>

                  {/* Waypoint List */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                      <span>Configured Stops Sequence</span>
                      {waypoints.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setWaypoints([])}
                          className="text-rose-500 hover:underline text-[11px]"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    {waypoints.length === 0 ? (
                      <div className="p-6 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                        <div className="w-10 h-10 mx-auto bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                          <Layers size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-600">No intermediate waypoints added yet</p>
                        <p className="text-[11px] text-slate-400 max-w-[240px] mx-auto">
                          Search places above or simply click along the road on the map to drop stops in order.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {waypoints.map((wp, idx) => (
                          <div
                            key={wp.id || idx}
                            className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2 hover:bg-slate-100/60 transition-colors group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-xs">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{wp.name}</p>
                                {wp.lat && wp.lng && (
                                  <p className="text-[10px] font-mono text-slate-500 truncate">
                                    {wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleMoveWaypoint(idx, -1)}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                                title="Move up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveWaypoint(idx, 1)}
                                disabled={idx === waypoints.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                                title="Move down"
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveWaypoint(idx)}
                                className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors ml-1"
                                title="Remove waypoint"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('destination')}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      ← Back to Destination
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                    >
                      Route Overview <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-5 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-100"></div>
                      <h3 className="font-bold text-slate-800 text-sm">Route Details & Status</h3>
                    </div>
                  </div>

                  {apiError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                      <strong>Backend Notice:</strong> {apiError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Route Number *
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3.5 top-3 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="e.g. 138"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-semibold"
                        value={routeNumber}
                        onChange={(e) => setRouteNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Route Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pettah - Homagama"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                      value={routeName || (origin.name && destination.name ? `${origin.name} - ${destination.name}` : (origin.name || ''))}
                      onChange={(e) => {
                        setRouteName(e.target.value);
                        setIsManualRouteName(true);
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Initial Status
                    </label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none font-medium"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Maintenance</option>
                    </select>
                  </div>

                  {/* Route Summary Card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Route Highlights</span>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-500">Origin:</span>
                        <strong className="text-slate-800 truncate">{origin.name || 'Not set'}</strong>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <span className="text-slate-500">Waypoints:</span>
                        <strong className="text-slate-800">{waypoints.length} intermediate stops</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        <span className="text-slate-500">Destination:</span>
                        <strong className="text-slate-800 truncate">{destination.name || 'Not set'}</strong>
                      </div>

                      {totalDistanceKm > 0 && (
                        <div className="pt-2 border-t border-slate-200/70 flex justify-between items-center text-[11px] text-slate-600">
                          <span>Estimated Span:</span>
                          <span className="font-bold font-mono text-blue-600">{totalDistanceKm.toFixed(1)} km</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Panel: Interactive Map & JSON viewer */}
          <div className="flex-1 bg-slate-50 flex flex-col p-4 md:p-6 gap-4 overflow-hidden">
            
            {/* Map Box */}
            <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white relative">
              
              {/* Floating Map Toolbar */}
              <div className="absolute top-4 left-4 z-[400] flex flex-wrap gap-2 pointer-events-auto">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{allRoutePoints.length} Stops Placed</span>
                  {totalDistanceKm > 0 && (
                    <span className="text-slate-400 font-normal">| ~{totalDistanceKm.toFixed(1)} km</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleFitRouteBounds}
                  disabled={allRoutePoints.length === 0}
                  className="bg-white/90 hover:bg-white disabled:opacity-40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-1.5 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                  title="Fit whole route in view"
                >
                  <Maximize2 size={13} /> Fit Route
                </button>
              </div>

              {/* Map Legend on bottom left */}
              <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/80 shadow-md text-[10px] space-y-1 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold text-slate-700">Origin (Start)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="font-semibold text-slate-700">Waypoints (Stops)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="font-semibold text-slate-700">Destination (End)</span>
                </div>
              </div>

              <MapContainer
                center={[6.9271, 79.8612]} // Default centered on Colombo, Sri Lanka
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                <MapController focusTarget={focusTarget} allCoordinates={polylinePositions} />
                <MapClickHandler onMapClick={handleMapClick} isClickToAddEnabled={isClickToAddEnabled} />

                {/* Polyline Route Line */}
                {polylinePositions.length > 1 && (
                  <Polyline
                    positions={polylinePositions}
                    color="#2563eb"
                    weight={4}
                    opacity={0.85}
                    dashArray="6, 8"
                  />
                )}

                {/* Origin Marker */}
                {origin.lat && origin.lng && (
                  <Marker
                    position={[origin.lat, origin.lng]}
                    icon={createCustomMarkerIcon('START', '#10b981', '#ffffff', '#ffffff')}
                  >
                    <Popup>
                      <div className="p-1 font-sans">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Origin</span>
                        <h4 className="font-bold text-xs text-slate-800">{origin.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">
                          {origin.lat.toFixed(5)}, {origin.lng.toFixed(5)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Destination Marker */}
                {destination.lat && destination.lng && (
                  <Marker
                    position={[destination.lat, destination.lng]}
                    icon={createCustomMarkerIcon('END', '#ef4444', '#ffffff', '#ffffff')}
                  >
                    <Popup>
                      <div className="p-1 font-sans">
                        <span className="text-[10px] font-bold text-rose-600 uppercase">Destination</span>
                        <h4 className="font-bold text-xs text-slate-800">{destination.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">
                          {destination.lat.toFixed(5)}, {destination.lng.toFixed(5)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Waypoint Markers */}
                {waypoints.map((wp, idx) => {
                  if (!wp.lat || !wp.lng) return null;
                  return (
                    <Marker
                      key={wp.id || idx}
                      position={[wp.lat, wp.lng]}
                      icon={createCustomMarkerIcon(`${idx + 1}`, '#3b82f6', '#ffffff', '#ffffff')}
                    >
                      <Popup>
                        <div className="p-1 font-sans">
                          <span className="text-[10px] font-bold text-blue-600 uppercase">Waypoint #{idx + 1}</span>
                          <h4 className="font-bold text-xs text-slate-800">{wp.name}</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-1">
                            {wp.lat.toFixed(5)}, {wp.lng.toFixed(5)}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Structured Coordinates Output Panel */}
            <div className="h-[140px] bg-[#0b1329] rounded-2xl p-4 font-mono text-[11px] overflow-hidden flex flex-col border border-slate-800">
              <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 flex-shrink-0">
                <span className="text-slate-400 text-xs font-semibold tracking-tight">
                  GPS Coordinates Registry ({allRoutePoints.length} points)
                </span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center gap-1 transition-colors"
                >
                  {copiedJson ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                  {copiedJson ? 'Copied' : 'Copy JSON'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <pre className="text-emerald-400 leading-relaxed">
                  {allRoutePoints.length > 0
                    ? JSON.stringify(
                        {
                          routeNumber: routeNumber || '138',
                          routeName: routeName || `${origin.name || 'Origin'} - ${destination.name || 'Destination'}`,
                          origin: origin.lat && origin.lng ? `${origin.lat},${origin.lng}` : (origin.name || ''),
                          destination: destination.lat && destination.lng ? `${destination.lat},${destination.lng}` : (destination.name || ''),
                          waypoints: waypoints.map(w => (w.lat && w.lng ? `${w.lat},${w.lng}` : (typeof w === 'string' ? w : w.name || ''))),
                        },
                        null,
                        2
                      )
                    : '// Search places on Origin, Destination & Waypoints tabs or click map to register coordinates...'}
                </pre>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-slate-100 bg-white flex justify-between items-center flex-shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            {origin.name && destination.name ? (
              <span className="text-slate-700 font-semibold">
                📍 {origin.name} ➔ {destination.name} ({waypoints.length} intermediate stops)
              </span>
            ) : (
              'Set origin and destination to complete route'
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all text-xs"
            >
              Cancel
            </button>
            <button
              onClick={submitNewRoute}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 font-bold text-white shadow-lg shadow-blue-200 transition-all flex items-center gap-2 text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving to Backend...
                </>
              ) : (
                '✓ Save Route'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Addroute;