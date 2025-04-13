
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NewsLinks.css";

const NewsLinks = ({ news: initialNews }) => {
  const [news, setNews] = useState(initialNews || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState("AI");
  const [activeCategory, setActiveCategory] = useState(0);

  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const categories = [
    "AI",
    "LLM",
    "NVIDIA",
    "OpenAI",
    "MetaAI",
    "Microsoft Copilot",
    "IBM",
    "DeepSeek AI",
    "Gemini AI",
  ];

  // Gradient colors for different categories
  const categoryGradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
    "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%)",
  ];

  const fetchNews = async (topic) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://blog-website-vmrz.onrender.com/api/news/${topic}`);
      setNews(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setNews([]);
    }
    setLoading(false);
  };

  const selectCategory = (index) => {
    setActiveCategory(index);
    const selectedTopic = categories[index].toLowerCase();
    setTopic(selectedTopic);
    fetchNews(selectedTopic);
  };

  useEffect(() => {
    if (!initialNews || initialNews.length === 0) {
      fetchNews(topic);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading the latest news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => fetchNews(topic)}>Retry</button>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>No articles found</h3>
        <p>Try selecting a different category</p>
      </div>
    );
  }

  return (
    <div className="news-app">
      <div className="category-selector">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`category-btn ${activeCategory === index ? "active" : ""}`}
            onClick={() => selectCategory(index)}
            style={{
              background: activeCategory === index ? categoryGradients[index] : "#f5f5f7",
              color: activeCategory === index ? "white" : "#333",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="news-grid">
        {news.map((article, index) => (
          <div
            key={`${article.url}-${index}`}
            className="news-card"
            onClick={() => window.open(article.url, "_blank")}
          >
            {article.imageUrl && (
              <div className="card-image">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Available";
                  }}
                />
                <div className="image-overlay"></div>
              </div>
            )}
            <div className="card-content">
              <span className="card-category" style={{ background: categoryGradients[activeCategory] }}>
                {categories[activeCategory]}
              </span>
              <h3 className="card-title">{article.title}</h3>
              <p className="card-description">
                {article.description?.substring(0, 120)}
                {article.description?.length > 120 ? "..." : ""}
              </p>
              <div className="card-footer">
                <span className="card-source">{article.source || "Unknown"}</span>
                <span className="card-date">
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsLinks;