import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MenuColorProvider, useMenuColor } from "./contexts/MenuColorContext";
import "./App.css";

import InteractiveMenu from "./components/public/interactivemenu/InteractiveMenu";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import AdminOverview from "./pages/adminPages/AdminOverview";
import AdminDashboard from "./pages/adminPages/AdminDashboard";
import AdminAboutEditor from "./pages/adminPages/AdminAboutEditor";
import AdminPortfolioEditor from "./pages/adminPages/AdminPortfolioEditor";
import AdminAddPortfolioItem from "./pages/adminPages/AdminAddPortfolioItem";
import AdminEditPortfolioItem from "./pages/adminPages/AdminEditPortfolioItem";

function AppContent() {
  const { menuIconColor } = useMenuColor();
  return <InteractiveMenu menuIconColor={menuIconColor} />;
}

function App() {
  return (
    <AuthProvider>
      <MenuColorProvider>
        <Router>
          <AppContent />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="about" element={<AdminAboutEditor />} />
              <Route path="portfolio" element={<AdminPortfolioEditor />} />
            </Route>

            {/* Kept for now, consider nesting under /admin/portfolio or a dedicated portfolio management layout */}
            <Route
              path="/admin/portfolio/new"
              element={
                <ProtectedRoute>
                  <AdminAddPortfolioItem />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/portfolio/edit/:itemId"
              element={
                <ProtectedRoute>
                  <AdminEditPortfolioItem />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </MenuColorProvider>
    </AuthProvider>
  );
}

export default App;
