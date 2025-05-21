import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useSprings, animated, useTransition } from '@react-spring/web'
import { AuthProvider, useAuth } from './contexts/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ProtectedRoute from './components/ProtectedRoute'
import AboutPage from './pages/AboutPage'
import PortfolioPage from './pages/PortfolioPage'
import AdminAboutPage from './pages/AdminAboutPage';
import AdminPortfolioPage from './pages/AdminPortfolioPage';
import AdminAddPortfolioItemPage from './pages/AdminAddPortfolioItemPage';
import AdminEditPortfolioItemPage from './pages/AdminEditPortfolioItemPage';

import './App.css'

const NUM_DOTS = 100; // Increased number for a denser dot field

const getRandomPosition = () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
});

// --- Shooting Star Constants ---
const MIN_SHOOTING_STAR_INTERVAL = 3000; 
const MAX_SHOOTING_STAR_INTERVAL = 8000; 
const SHOOTING_STAR_DURATION = 1000; 

let shootingStarIdCounter = 0; // Unique ID generator for keys

const AnimatedShapesBackground = () => {
  const [dots, setDots] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);

  // --- Dots Initialization ---
  useEffect(() => {
    setDots(
      Array.from({ length: NUM_DOTS }).map((_, i) => ({
        id: `dot-${i}`,
        x: getRandomPosition().x,
        y: getRandomPosition().y,
        size: Math.random() * 3 + 2,
      }))
    );
  }, []);

  // --- Dots Animation ---
  const dotSprings = useSprings(
    dots.length,
    dots.map(dot => ({
      to: async (next) => {
        if (typeof dot.x === 'undefined') return;
        while (true) {
          await next({ 
            opacity: Math.random() * 0.7 + 0.3,
            scale: Math.random() * 0.5 + 0.8,
          });
        }
      },
      from: { opacity: 0, scale: 0.8 },
      config: { duration: Math.random() * 3000 + 2000 },
      reset: false,
      delay: Math.random() * 4000,
    }))
  );

  // --- Shooting Star Generation ---
  useEffect(() => {
    const createShootingStar = () => {
      const id = `ss-${shootingStarIdCounter++}`;
      const startEdge = Math.floor(Math.random() * 4);
      let fromX, fromY, toX, toY;
      const angleOffset = (Math.random() - 0.5) * (Math.PI / 6); // +/- 30 degrees variance from perpendicular
      const length = Math.random() * 100 + 150; // Length of the star's trail visually

      switch (startEdge) {
        case 0: // Top, shooting down-ish
          fromX = Math.random() * window.innerWidth;
          fromY = -20; // Start off-screen top
          toX = fromX + Math.sin(angleOffset) * length * (Math.random() > 0.5 ? 1 : -1) * 3; // Wider spread
          toY = window.innerHeight + 20;
          break;
        case 1: // Right, shooting left-ish
          fromX = window.innerWidth + 20;
          fromY = Math.random() * window.innerHeight;
          toX = -20;
          toY = fromY + Math.sin(angleOffset) * length * (Math.random() > 0.5 ? 1 : -1) * 3;
          break;
        case 2: // Bottom, shooting up-ish
          fromX = Math.random() * window.innerWidth;
          fromY = window.innerHeight + 20;
          toX = fromX - Math.sin(angleOffset) * length * (Math.random() > 0.5 ? 1 : -1) * 3;
          toY = -20;
          break;
        default: // Left (3), shooting right-ish
          fromX = -20;
          fromY = Math.random() * window.innerHeight;
          toX = window.innerWidth + 20;
          toY = fromY - Math.sin(angleOffset) * length * (Math.random() > 0.5 ? 1 : -1) * 3;
          break;
      }

      setShootingStars(prevStars => [
        ...prevStars,
        { id, fromX, fromY, toX, toY }
      ]);
    };

    let timeoutId;
    const scheduleStar = () => {
      const interval = Math.random() * (MAX_SHOOTING_STAR_INTERVAL - MIN_SHOOTING_STAR_INTERVAL) + MIN_SHOOTING_STAR_INTERVAL;
      timeoutId = setTimeout(() => {
        createShootingStar();
        scheduleStar();
      }, interval);
    };
    scheduleStar();
    return () => clearTimeout(timeoutId);
  }, []);

  // --- Shooting Star Animation (useTransition) ---
  const shootingStarTransitions = useTransition(shootingStars, {
    keys: item => item.id,
    from: item => ({ x: item.fromX, y: item.fromY, opacity: 1 }),
    enter: item => ({ x: item.toX, y: item.toY, opacity: 0 }), // Fades out as it reaches destination
    leave: { opacity: 0 }, // Should already be 0 from enter, but good for explicit removal
    config: { duration: SHOOTING_STAR_DURATION, easing: t => t }, // Linear movement
    onRest: (result, ctrl, item) => {
      setShootingStars(prev => prev.filter(s => s.id !== item.id));
    },
  });

  if (!dots.length && !shootingStars.length) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
      }}
    >
      {/* Render Dots */}
      {dotSprings.map((props, index) => {
        const currentDot = dots[index];
        if (!currentDot) return null;
        return (
          <animated.div
            key={currentDot.id}
            style={{
              position: 'absolute',
              top: currentDot.y,
              left: currentDot.x,
              width: currentDot.size,
              height: currentDot.size,
              backgroundColor: 'white',
              borderRadius: '50%',
              opacity: props.opacity,
              transform: props.scale.to(s => `scale(${s})`),
              willChange: 'opacity, transform',
            }}
          />
        );
      })}
      {/* Render Shooting Stars */}
      {shootingStarTransitions((style, item) => (
          <animated.div
            key={item.id} // Key is from item.id itself
            style={{
              position: 'absolute',
              width: '80px', // Visual length of the star
              height: '1.5px',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '1px',
              opacity: style.opacity,
              // Calculate angle for rotation
              transform: style.x.to((x, i) => { // style.x is an AnimatedValue
                // We need y from style too, but to is a single value for transform
                // A bit tricky to get angle dynamically with translate3d like this from separate x, y springs
                // Simpler approach: transform with x, y, and calculate rotation once
                const angle = Math.atan2(item.toY - item.fromY, item.toX - item.fromX) * (180 / Math.PI);
                return `translate3d(${style.x.get()}px, ${style.y.get()}px, 0) rotate(${angle}deg)`;
              }),
              transformOrigin: '0% 50%', // Rotate from the leading edge
              willChange: 'opacity, transform',
            }}
          />
        ))}
    </div>
  );
};

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
          ) : (
            <Link to="/login" className={`navLink navButton`}>登入</Link> // Changed from styles and combined classes
          )}
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
