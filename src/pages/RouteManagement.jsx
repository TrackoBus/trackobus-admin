import React, { useState, useEffect } from 'react';
import Addroute from './Addroute'; 
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchRoutesApi, deleteRouteApi } from '../services/api';

const defaultRoutes = [
  { id: '100', name: 'Colombo - Panadura', fromTo: 'Colombo → Panadura', status: 'Active' },
  { id: '138', name: 'Pettah - Maharagama', fromTo: 'Pettah → Maharagama', status: 'Active' },
  { id: '177', name: 'Kollupitiya - Kaduwela', fromTo: 'Kollupitiya → Kaduwela', status: 'Active' },
  { id: '120', name: 'Fort - Kaduwela', fromTo: 'Fort → Kaduwela', status: 'Active' },
  { id: '154', name: 'Dehiwala - Maharagama', fromTo: 'Dehiwala → Maharagama', status: 'Active' },
  { id: '102', name: 'Pettah - Battaramulla', fromTo: 'Pettah → Battaramulla', status: 'Maintenance' },
  { id: '400', name: 'Kandy Road - Rajagiriya', fromTo: 'Kandy Rd → Rajagiriya', status: 'Active' },
  { id: '240', name: 'Maradana - Panadura', fromTo: 'Maradana → Panadura', status: 'Inactive' },
];

// Helper to format From → To with human-readable location names parsed from routeName or locations
const getLocationDisplay = (route) => {
  if (route.originName && route.destinationName) {
    return `${route.originName} → ${route.destinationName}`;
  }
  // If routeName has "Origin - Destination" (e.g. "Colombo - Panadura"), convert to "Colombo → Panadura"
  const name = route.routeName || route.name || '';
  if (name.includes(' - ')) {
    const parts = name.split(' - ');
    return `${parts[0].trim()} → ${parts.slice(1).join(' - ').trim()}`;
  }
  if (route.fromTo && !/^-?\d+\.\d+\s*,\s*-?\d+\.\d+/.test(route.fromTo)) {
    return route.fromTo;
  }
  return name || 'Route';
};

const RouteManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [routes, setRoutes] = useState(defaultRoutes);

  // Fetch routes from backend (/trck/api/routes) on initial mount
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const backendRoutes = await fetchRoutesApi();
        if (Array.isArray(backendRoutes) && backendRoutes.length > 0) {
          const formatted = backendRoutes.map((r) => ({
            id: r.routeNumber || String(r.id),
            dbId: r.id,
            name: r.routeName || r.name,
            fromTo: getLocationDisplay(r),
            status: r.status || 'Active',
          }));
          setRoutes(formatted);
        }
      } catch (err) {
        console.warn('Using default routes due to API fetch error:', err);
      }
    };
    loadRoutes();
  }, []);

  const handleSaveNewRoute = (newRouteData) => {
    const newEntry = {
      id: newRouteData.routeNumber || String(newRouteData.id),
      name: newRouteData.routeName || newRouteData.name,
      fromTo: getLocationDisplay(newRouteData),
      status: newRouteData.status || 'Active',
    };
    setRoutes([newEntry, ...routes]);
    setShowAddModal(false);
  };

  const openDeleteModal = (id) => {
    setRouteToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (routeToDelete) {
      deleteRouteApi(routeToDelete).catch(() => {});
      setRoutes(routes.filter(route => route.id !== routeToDelete));
    }
    setIsDeleteModalOpen(false);
    setRouteToDelete(null);
  };

  const filteredRoutes = routes.filter(route => 
    route.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    route.id.includes(searchTerm)
  );

  return (
    <div className="font-sans">
      
      {/* 1. Aligned Header: Subtitle aligns with title and Button is level */}
      <div className="flex justify-between items-center mb-15 -mt-6">
        <div>
          <p className="text-slate-500 text-sm font-medium">
            {routes.length} routes configured · {routes.filter(r => r.status === 'Active').length} active
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#1e60ff] hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={18} /> Add New Route
        </button>
      </div>

      {/* 2. Table Container: White box card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search routes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-400" 
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">{filteredRoutes.length} results</span>
        </div>

        <table className="w-full text-left">
          <thead className="bg-white text-[11px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-50">
            <tr>
              <th className="px-6 py-4">Route #</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">From → To</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRoutes.map((route) => (
              <tr key={route.id || route.dbId} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">
                    {route.id}
                  </span>
                </td>
                <td className="px-6 py-5 font-bold text-slate-700 text-sm">{route.name}</td>
                <td className="px-6 py-5 text-slate-500 font-medium text-xs">{route.fromTo}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                    route.status === 'Active' ? 'bg-green-50 text-green-600' : 
                    route.status === 'Maintenance' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${
                      route.status === 'Active' ? 'bg-green-600' : 
                      route.status === 'Maintenance' ? 'bg-orange-600' : 'bg-slate-400'
                    }`}></span>
                    {route.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-3 text-slate-300">
                    <Edit2 size={16} className="hover:text-blue-600 cursor-pointer transition-colors" />
                    <Trash2 
                      size={16} 
                      className="hover:text-red-500 cursor-pointer transition-colors" 
                      onClick={() => openDeleteModal(route.id)} 
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <Addroute 
          onSave={handleSaveNewRoute} 
          onClose={() => setShowAddModal(false)} 
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[24px] p-6 max-w-[340px] w-full shadow-2xl transform transition-all animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                <Trash2 className="text-red-500" size={28} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Route?</h2>
              <p className="text-slate-500 text-xs leading-relaxed mb-6 px-4">
                This will permanently remove the route. This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-[#ef4444] hover:bg-red-600 font-bold text-white shadow-md shadow-red-100 transition-all text-xs"
                >
                  Delete Route
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteManagement;