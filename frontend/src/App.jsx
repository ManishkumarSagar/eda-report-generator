import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import UploadDataset from './pages/UploadDataset'
import Analysis from './pages/Analysis'
import Insights from './pages/Insights'
import Reports from './pages/Reports'
import History from './pages/History'
import Profile from './pages/Profile'

function App() {
  return (
    <>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — require login */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadDataset /></ProtectedRoute>} />
          <Route path="/analysis/:id" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
          <Route path="/insights/:id" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
    </>
  )
}

export default App
