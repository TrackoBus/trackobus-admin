import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

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
  // Sync Firebase Auth Token automatically whenever auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem('token', token);
          localStorage.setItem('isAuthenticated', 'true');
          console.log('[TrackoBus Auth] Firebase user active, token synced.');
        } catch (err) {
          console.warn('[TrackoBus Auth] Failed to get user ID token:', err);
        }
      } else {
        localStorage.removeItem('token');
      }
    });

    return () => unsubscribe();
  }, []);
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