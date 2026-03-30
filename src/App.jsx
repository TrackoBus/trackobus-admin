import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Public Pages
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';

// Admin Protected Pages (Check your src/pages folder for exact names!)
import Home from './pages/Home'; 
import RouteManagement from './pages/RouteManagement'; 
import Setting from './pages/Setting'; 
import UserRewards from './pages/UserRewards';       
import SystemLogs from './pages/SystemLogs';         

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Route: Login is the starting page */}
        <Route path="/" element={<Login />} />
        
        {/* 2. Admin Layout Wrapper */}
        <Route element={<AdminLayout />}>
          
          {/* 3. The Actual TrackoBus Pages */}
          <Route path="/dashboard" element={<Home />} />
          <Route path="/route-management" element={<RouteManagement />} />
          <Route path="/user-rewards" element={<UserRewards />} />
          <Route path="/system-logs" element={<SystemLogs />} />
          <Route path="/settings" element={<Setting />} />
          
          {/* 4. Catch-all redirect: If someone types a bad URL, send them to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;