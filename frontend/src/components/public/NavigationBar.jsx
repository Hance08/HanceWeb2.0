import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // 注意路徑調整
// 如果有使用 App.css 中的樣式，且希望這個元件獨立使用，則需要在此處匯入或建立新的 CSS 檔案
// import './NavigationBar.css'; // 假設的 CSS 檔案
// 或者，如果樣式是全域的 (例如在 App.css 中定義並影響整個應用程式)，則可能不需要額外匯入

const NavigationBar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="mainNavOverlay">
      {" "}
      {/* Changed from styles.mainNavOverlay */}
      <nav className="navContainer">
        {" "}
        {/* Changed from styles.navContainer */}
        <Link to="/" className="navLink">
          Hance Web
        </Link>{" "}
        {/* Changed from styles.navLink */}
        <div className="navLinksGroup">
          {" "}
          {/* Changed from styles.navLinksGroup */}
          <Link to="/about" className="navLink">
            關於我
          </Link>
          <Link to="/portfolio" className="navLink">
            作品集
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="navLink">
                管理後台
              </Link>
            </>
          ) : (
            ""
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavigationBar;
