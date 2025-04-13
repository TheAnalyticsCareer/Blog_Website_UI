



import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SwitchPage.css";

const SwitchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isNewsActive = location.pathname === "/news" || location.pathname === "/";
  const isBlogsActive = location.pathname === "/blogs";

  return (
    <header className="switch-header">
      <div className="switch-container">
        <div className="switch-btn-container">
          <button 
            onClick={() => navigate("/news")}
            className={`switch-btn ${isNewsActive ? 'active news-active' : ''}`}
          >
            <span className="btn-content">
              <span className="btn-text">News</span>
            </span>
          </button>
          <button 
            onClick={() => navigate("/blogs")}
            className={`switch-btn ${isBlogsActive ? 'active blog-active' : ''}`}
          >
            <span className="btn-content">
              <span className="btn-text">Blogs</span>
            </span>
          </button>
          <div className="switch-highlight" style={{
            left: isNewsActive ? '4px' : 'calc(50% + 4px)',
            backgroundColor: isNewsActive ? '#3b82f6' : '#10b981'
          }} />
        </div>
      </div>
    </header>
  );
};

export default SwitchPage;