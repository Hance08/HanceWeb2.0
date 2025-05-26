import React, { useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
library.add(fas, fab)

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import AboutPage from './pages/AboutPage'
import PortfolioPage from './pages/PortfolioPage'
import AdminAboutEditorPage from './pages/adminPages/AdminAboutEditorPage'; // Ensure this is imported
import AdminDashboardPage from './pages/adminPages/AdminDashboardPage'
// import AdminPortfolioPage from './pages/adminPages/AdminPortfolioPage'; // Will be replaced by PortfolioEditor under AdminDashboardPage
import AdminAddPortfolioItemPage from './pages/adminPages/AdminAddPortfolioItemPage';
import AdminEditPortfolioItemPage from './pages/adminPages/AdminEditPortfolioItemPage';

// New Admin Sub-Page Components
import AdminOverview from './pages/adminPages/AdminOverview';
import AdminPortfolioEditor from './pages/adminPages/AdminPortfolioEditor';

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
      {/* <AnimatedShapesBackground /> */}
      <Router>
        <NavigationBar /> {/* Added NavigationBar here */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />

          {/* Admin Routes - AdminDashboardPage as layout for nested routes */}
          <Route 
            path="/admin" 
            element={ <ProtectedRoute><AdminDashboardPage /></ProtectedRoute> }
          >
            <Route index element={<AdminOverview />} /> {/* Default for /admin */}
            <Route path="about" element={<AdminAboutEditorPage />} /> {/* Changed to AdminAboutPage */}
            <Route path="portfolio" element={<AdminPortfolioEditor />} />
            {/* 
              The following routes for portfolio item management might also be nested 
              under /admin/portfolio in the future, or kept separate if their layout differs.
              For now, they are kept as is for minimal disruption.
            */}
          </Route>

          {/* Kept for now, consider nesting under /admin/portfolio or a dedicated portfolio management layout */}
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

          {/* Old admin routes - to be removed as they are now nested */}
          {/* 
          <Route path="/admin/about" element={
            <ProtectedRoute>
              <AdminAboutPage /> // This was the old, non-nested route
            </ProtectedRoute>
          } />

          <Route path="/admin/portfolio" element={
            <ProtectedRoute>
              <AdminPortfolioPage />
            </ProtectedRoute>
          } />
          */}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
