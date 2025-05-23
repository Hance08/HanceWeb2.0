import React, { useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import AboutPage from './pages/AboutPage'
import PortfolioPage from './pages/PortfolioPage'
import AdminAboutPage from './pages/adminPages/AdminAboutPage';
import AdminDashboardPage from './pages/adminPages/AdminDashboardPage'
import AdminPortfolioPage from './pages/adminPages/AdminPortfolioPage';
import AdminAddPortfolioItemPage from './pages/adminPages/AdminAddPortfolioItemPage';
import AdminEditPortfolioItemPage from './pages/adminPages/AdminEditPortfolioItemPage';
import AnimatedShapesBackground from './components/AnimatedShapesBackground';

import './App.css'

// Navigation Bar Component (extracted and modified from HomePage)
const NavigationBar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();

  return (
    <div className="mainNavOverlay"> {/* Changed from styles.mainNavOverlay */}
      <nav className="navContainer"> {/* Changed from styles.navContainer */}
        <Link to="/" className="navLink">Hance Web</Link> {/* Changed from styles.navLink */}
        <div className="navLinksGroup"> {/* Changed from styles.navLinksGroup */}
          <Link to="/about" className="navLink">關於我</Link>
          <Link to="/portfolio" className="navLink">作品集</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="navLink">管理後台</Link>
              <span className="navUserGreeting">你好, {currentUser?.username || '管理員'}! </span> {/* Changed from styles.navUserGreeting */}
              <button 
                onClick={logout} 
                className={`ctaButton ctaButtonDanger navButton`} // Changed from styles and combined classes
              >
                登出
              </button>
            </>
          ) : ""
          }
        </div>
      </nav>
    </div>
  );
};

function App() {
  console.log("App component rendering...");

  return (
    <AuthProvider>
      <AnimatedShapesBackground />
      <Router>
        <NavigationBar /> {/* Added NavigationBar here */}
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

          <Route path="/admin/portfolio/new" element={
            <ProtectedRoute>
              <AdminAddPortfolioItemPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/portfolio/edit/:itemId" element={
            <ProtectedRoute>
              <AdminEditPortfolioItemPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
