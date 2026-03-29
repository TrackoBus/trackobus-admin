import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/Dashboard'
import ManageRoutes from './pages/ManageRoutes'
import Settings from './pages/Settings'
import SystemLogs from './pages/SystemLogs'
import UserRewards from './pages/UserRewards'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="routes" element={<ManageRoutes />} />
          <Route path="user-rewards" element={<UserRewards />} />
          <Route path="system-logs" element={<SystemLogs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
