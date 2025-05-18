import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function AdminDashboardPage() {
  const { currentUser, logout } = useAuth();

  return (
    <div>
      <h1>管理後台</h1>
      <p>你好, {currentUser?.username || '管理員'}! 歡迎來到管理介面。</p>
      <nav>
        <Link to="/">回到首頁</Link> | 
        {/* Add links to other admin sections here */}
        {/* <Link to="/admin/about">編輯關於我</Link> | */}
        {/* <Link to="/admin/portfolio">管理作品集</Link> | */}
        <button onClick={logout}>登出</button>
      </nav>
      <div>
        <p>這裡將是管理各種網站內容的地方。</p>
      </div>
    </div>
  );
}

export default AdminDashboardPage; 