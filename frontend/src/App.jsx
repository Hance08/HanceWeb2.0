import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ProtectedRoute from './components/ProtectedRoute'
import AboutPage from './pages/AboutPage'
import PortfolioPage from './pages/PortfolioPage'
import AdminAboutPage from './pages/AdminAboutPage';
import AdminPortfolioPage from './pages/AdminPortfolioPage';

import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />

          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/about" element={
            <ProtectedRoute>
              <AdminAboutPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/portfolio" element={
            <ProtectedRoute>
              <AdminPortfolioPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
