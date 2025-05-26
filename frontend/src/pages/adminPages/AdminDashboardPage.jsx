import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, Outlet, NavLink } from 'react-router-dom'; // Import Outlet and NavLink
import styles from './css/AdminDashboardPage.module.css'; // 匯入 CSS Modules

function AdminDashboardPage() {
  const { currentUser, logout } = useAuth();

  // Helper to apply active style for NavLink
  const getNavLinkClass = ({ isActive }) => {
    return isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <h1 className={styles.sidebarHeader}>管理後台</h1>
        <p className={styles.welcomeMessageSidebar}>你好, {currentUser?.username || '管理員'}!</p>
        <nav className={styles.sidebarNav}>
          <NavLink to="/" className={getNavLinkClass}>回到首頁</NavLink>
          {/* Assuming your admin overview/index route is at /admin */}
          <NavLink to="/admin" end className={getNavLinkClass}>總覽</NavLink>
          <NavLink to="/admin/about" className={getNavLinkClass}>管理關於我</NavLink>
          <NavLink to="/admin/portfolio" className={getNavLinkClass}>管理作品集</NavLink>
          {/* Add links to other admin sections here, e.g.: */}
          {/* <NavLink to="/admin/blog" className={getNavLinkClass}>管理部落格</NavLink> */}
        </nav>
        <button onClick={logout} className={styles.logoutButton}>登出</button>
      </aside>
      <main className={styles.mainContent}>
        <Outlet /> {/* This is where nested routes will render */}
      </main>
    </div>
  );
}

export default AdminDashboardPage; 