import React from 'react';
import { Search, Plus, Edit2, Trash2, Bus } from 'lucide-react';

const RouteManagement = () => {
  const routes = [
    { id: '138', name: 'Pettah - Homagama', fromTo: 'Pettah → Homagama', active: 4, status: 'Active' },
    { id: '120', name: 'Fort - Kaduwela', fromTo: 'Fort → Kaduwela', active: 3, status: 'Active' },
    { id: '154', name: 'Dehiwala - Maharagama', fromTo: 'Dehiwala → Maharagama', active: 2, status: 'Active' },
    { id: '177', name: 'Borella - Kottawa', fromTo: 'Borella → Kottawa', active: 5, status: 'Active' },
    { id: '102', name: 'Pettah - Battaramulla', fromTo: 'Pettah → Battaramulla', active: 0, status: 'Maintenance' },
    { id: '400', name: 'Kandy Road - Rajagiriya', fromTo: 'Kandy Rd → Rajagiriya', active: 6, status: 'Active' },
    { id: '240', name: 'Maradana - Panadura', fromTo: 'Maradana → Panadura', active: 0, status: 'Inactive' },
    { id: '310', name: 'Fort - Galle Face - Wellawatte', fromTo: 'wellawatte', active: 3, status: 'Active' },
  ];

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Bus Routes</h1>
          <p className="text-slate-500 text-sm font-medium">8 routes configured · 6 active</p>
        </div>
        <button className="bg-[#1e60ff] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 text-sm transition-all shadow-sm">
          <Plus size={18} /> Add New Route
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Search Header */}
        <div className="p-5 border-b border-slate-50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search routes..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Real Table */}
        <table className="w-full text-left">
          <thead className="bg-white text-[10px] uppercase font-bold text-slate-400 border-b border-slate-50">
            <tr>
              <th className="px-6 py-4">Route #</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">From → To</th>
              <th className="px-6 py-4 text-center">Active Buses</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm">
                    {route.id}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-bold text-slate-700">{route.name}</p>
                </td>
                <td className="px-6 py-5 text-slate-400 text-xs font-medium">
                  {route.fromTo}
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-green-600">
                     <Bus size={14} className="opacity-50" /> {route.active}
                   </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                    route.status === 'Active' ? 'bg-green-50 text-green-600' : 
                    route.status === 'Maintenance' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      route.status === 'Active' ? 'bg-green-600' : 
                      route.status === 'Maintenance' ? 'bg-orange-600' : 'bg-slate-400'
                    }`}></span>
                    {route.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-3 text-slate-300">
                    <Edit2 size={16} className="hover:text-blue-600 cursor-pointer" />
                    <Trash2 size={16} className="hover:text-red-500 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteManagement;