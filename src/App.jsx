import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Settings from './pages/Settings';
import RouteManagement from './pages/RouteManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login is outside the layout (no sidebar) */}
        <Route path="/" element={<Login />} />
        
        {/* All other pages stay inside the layout */}
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen bg-[#f8fafc]">
              <Sidebar />
              <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/route-management" element={<RouteManagement />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;