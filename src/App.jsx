import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Setting from './pages/Setting'; 
import RouteManagement from './pages/RouteManagement';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Login is the starting page */}
        <Route path="/" element={<Login />} />
        
        {/* 2. Admin Layout Wrapper */}
        <Route element={<AdminLayout />}>
          
          {/* 3. The Actual Pages */}
          <Route path="/dashboard" element={<Home />} /> 
          <Route path="/settings" element={<Setting />} />
          
          {/* FIX: We replace the test message with your actual file component */}
          <Route path="/route-management" element={<RouteManagement />} />
          
          {/* 4. Redirects for safety */}
          <Route path="/Home" element={<Navigate to="/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
