import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// 1. Add MapPin and X to your imports
import { MapPin, X } from 'lucide-react'; 

// --- Custom Numbered Icons ---
const createNumberedIcon = (number, color) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${number}</div>`,
    className: 'custom-number-icon',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick(e.latlng); } });
  return null;
}

const Addroute = ({ onSave, onClose }) => {
  const [waypoints, setWaypoints] = useState([]);
  const [formData, setFormData] = useState({ number: '', name: '', status: 'Active' });

  const handleMapClick = (latlng) => {
    setWaypoints((prev) => [...prev, { lat: latlng.lat.toFixed(4), lng: latlng.lng.toFixed(4) }]);
  };

  const handleSave = () => {
    if (!formData.number || !formData.name) {
      alert("Please enter Route Number and Name first!");
      return;
    }
    onSave({ ...formData, waypoints });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* --- UPDATED HEADER --- */}
        <div className="px-8 py-6 border-b flex justify-between items-center bg-white">
          <div className="flex items-center gap-4">
            {/* The Logo Box: Light blue background */}
            <div className="w-12 h-12 bg-[#f0f7ff] rounded-2xl flex items-center justify-center shadow-sm">
              {/* Modern Blue Location Icon */}
              <MapPin className="text-[#1e60ff]" size={26} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-[#1e293b]">Add New Route</h2>
          </div>
          
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-50"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <div className="w-[320px] p-8 border-r border-slate-50 flex flex-col">
            <div className="flex-1 space-y-6">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">Route Details</h3>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Route Number *</label>
                <input 
                  type="text" placeholder="e.g. 138" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all"
                  onChange={(e) => setFormData({...formData, number: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Route Name *</label>
                <input 
                  type="text" placeholder="e.g. Pettah - Homagama" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Status</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Maintenance</option>
                </select>
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-5 space-y-2 border border-blue-100/50">
                <h4 className="text-blue-800 font-bold text-[11px]">How to draw a route:</h4>
                <ul className="text-blue-600 text-[10px] space-y-1 font-medium">
                  <li>1. Click points on the map →</li>
                  <li>2. First point = Start</li>
                  <li>3. Last point = End</li>
                  <li>4. Coordinates auto-generate below</li>
                </ul>
              </div>

              <button 
                onClick={() => setWaypoints([])}
                className="text-red-500 text-xs font-bold hover:underline mt-4 text-left transition-all"
              >
                Clear all waypoints ({waypoints.length})
              </button>
            </div>
          </div>

          <div className="flex-1 bg-slate-50/50 p-6 flex flex-col gap-4">
            <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 z-0 shadow-sm bg-white">
              <MapContainer center={[6.9271, 79.8612]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler onMapClick={handleMapClick} />
                
                {waypoints.length > 1 && (
                  <Polyline positions={waypoints.map(w => [w.lat, w.lng])} color="#3b82f6" weight={3} />
                )}

                {waypoints.map((w, idx) => {
                  let color = "#3b82f6"; 
                  if (idx === 0) color = "#10b981"; 
                  if (idx === waypoints.length - 1 && idx !== 0) color = "#ef4444"; 
                  return (
                    <Marker key={idx} position={[w.lat, w.lng]} icon={createNumberedIcon(idx + 1, color)} />
                  );
                })}
              </MapContainer>
            </div>

            <div className="h-[180px] bg-[#0f172a] rounded-2xl p-5 font-mono text-[11px] overflow-y-auto border border-slate-800">
              <p className="text-slate-500 mb-3 text-xs tracking-tight">Generated Coordinates (JSON) — {waypoints.length} waypoints</p>
              <pre className="text-emerald-400">
                {waypoints.length > 0 
                  ? JSON.stringify(waypoints.map((w, i) => ({ point: i + 1, lat: w.lat, lng: w.lng })), null, 2)
                  : "// Click on the map above to generate coordinates..."}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
          >
            ✓ Save Route
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addroute;