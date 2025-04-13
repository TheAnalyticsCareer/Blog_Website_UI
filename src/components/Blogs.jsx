

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";

import "./Blogs.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAllBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/blogs`);
      setBlogs(res?.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  // ---------------------------------------------------------

  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: false,
    mangle: false,
  });


  const renderPlainText = (markdown) => {
    // Convert markdown to HTML
    const html = marked(markdown);
    // Create a temporary div to extract text content
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
};



const renderTitle = (title) => {
    const plainTitle = renderPlainText(title);
    return <h2 className="blog-title">{plainTitle}</h2>;
};




  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    const plainText = renderPlainText(content);
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
};

  const handleBlogClick = (blogId) => {
    navigate(`/blogDetails/${blogId}`);
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading blogs...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Blogs</h3>
        <p>{error}</p>
        <button onClick={getAllBlogs} className="retry-button">
          Retry
        </button>
      </div>
    );

  return (
    <div className="blogs-container">
      <header className="page-header">
        <h1>Latest Articles</h1>
       
      </header>

      <div className="blog-list">
      {blogs.map((blog) => {
                    const isAI = blog.content.includes('AI-generated') || 
                                blog.title.startsWith('##') || 
                                blog.content.startsWith('##');
                    
                    return (
                        <article 
                            key={blog.id} 
                            className={`blog-card ${isAI ? 'ai-generated' : ''}`}
                            onClick={() => handleBlogClick(blog.id)}
                        >
                            {isAI && <span className="ai-generated-marker"></span>}




            <div className="blog-meta">
              <span className="publish-date">
                {formatDate(blog.created_at)}
              </span>
              {blog.updated_at && blog.updated_at !== blog.created_at && (
                <span className="update-date">
                  Updated: {formatDate(blog.updated_at)}
                </span>
              )}
            </div>

            {renderTitle(blog.title)}

           

            <div className="blog-content-preview">
                                {truncateContent(blog.content)}
                                {isAI && (
                                    <span className="ai-content-marker">
                                       
                                    </span>
                                )}
                            </div>
                            
                            <div className="read-more">
                                Read full article →
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
};

export default Blogs;