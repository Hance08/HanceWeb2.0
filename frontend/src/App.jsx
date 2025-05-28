import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

import ProtectedRoute from "./components/ProtectedRoute";
import NavigationBar from "./components/public/NavigationBar";
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
import AnimatedShapesBackground from "./components/animation/AnimatedShapesBackground";

function App() {
  console.log("App component rendering...");

  return (
    <AuthProvider>
      {/* <AnimatedShapesBackground /> */}
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />

          {/* Admin Routes - AdminDashboardPage as layout for nested routes */}
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
    </AuthProvider>
  );
}

export default App;
