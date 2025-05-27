import React, { useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { library } from '@fortawesome/fontawesome-svg-core'
  import { fas } from '@fortawesome/free-solid-svg-icons'
  import { fab } from '@fortawesome/free-brands-svg-icons'
  library.add(fas, fab)

import Home from './pages/Home'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import AdminAboutEditor from './pages/adminPages/AdminAboutEditor'; // Ensure this is imported
import AdminDashboard from './pages/adminPages/AdminDashboard'
import AdminAddPortfolioItem from './pages/adminPages/AdminAddPortfolioItem';
import AdminEditPortfolioItem from './pages/adminPages/AdminEditPortfolioItem';

// New Admin Sub-Page Components
import AdminOverview from './pages/adminPages/AdminOverview';
import AdminPortfolioEditor from './pages/adminPages/AdminPortfolioEditor';

// import AnimatedShapesBackground from './components/AnimatedShapesBackground';

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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />

          {/* Admin Routes - AdminDashboardPage as layout for nested routes */}
          <Route 
            path="/admin" 
            element={ <ProtectedRoute><AdminDashboard /></ProtectedRoute> }
          >
            <Route index element={<AdminOverview />} /> {/* Default for /admin */}
            <Route path="about" element={<AdminAboutEditor />} /> {/* Changed to AdminAboutPage */}
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
              <AdminAddPortfolioItem />
            </ProtectedRoute>
          } />

          <Route path="/admin/portfolio/edit/:itemId" element={
            <ProtectedRoute>
              <AdminEditPortfolioItem />
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
