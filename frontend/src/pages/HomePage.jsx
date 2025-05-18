import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const { isAuthenticated, currentUser, logout } = useAuth();

  return (
    <div>
      <h1>歡迎來到我的個人網站</h1>
      <nav>
        <Link to="/">首頁</Link> | 
        {isAuthenticated ? (
          <>
            <Link to="/admin">管理後台</Link> | 
            <span>你好, {currentUser?.username || '管理員'}! </span>
            <button onClick={logout}>登出</button>
          </>
        ) : (
          <Link to="/login">登入</Link>
        )}
      </nav>
      <p>這裡是網站的公開首頁內容。</p>
    </div>
  );
}

export default HomePage; 