import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Public Pages
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';

// Admin Protected Pages 
import Home from './pages/Dashboard'; 
import RouteManagement from './pages/RouteManagement'; 
import Setting from './pages/Setting'; 
import UserRewards from './pages/UserRewards';       
import SystemLogs from './pages/SystemLogs';         

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/route-management" element={<RouteManagement />} />
          <Route path="/user-rewards" element={<UserRewards />} />
          <Route path="/system-logs" element={<SystemLogs />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;