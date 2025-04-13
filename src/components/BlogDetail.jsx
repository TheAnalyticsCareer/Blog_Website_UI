import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { marked } from "marked";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/getUniqueBlog/${blogId}`
        );

        if (res.data && res.data[0]) {
          setBlog(res.data[0]);
          // Convert markdown to HTML when data is received
          setHtmlContent(marked(res.data[0].content));
        } else {
          throw new Error("Blog not found");
        }

        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  // Configure marked.js options
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    headerPrefix: "",
    langPrefix: "language-",
    mangle: true,
    pedantic: false,
    sanitize: false,
    silent: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
  });

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading blog post...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Blog</h3>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );

  if (!blog)
    return (
      <div className="not-found">
        <h3>Blog Not Found</h3>
        <p>The requested blog post doesn't exist or may have been removed.</p>
      </div>
    );

  return (
    <div className="blog-detail-container">
      
      

      <div className="floating-actions">
        <button
          className="action-button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑
        </button>
     
      </div>

      <div className="blog-content-container">

      <article className="blog-article">
        <header>
          <h1>{blog.title.replace(/^##\s*/, "")}</h1>
          <div className="meta">
            <span>
              Published:{" "}
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {blog.updated_at && blog.updated_at !== blog.created_at && (
              <span>
                {" "}
                • Updated:{" "}
                {new Date(blog.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </header>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
      </div>
    </div>
  );
};

export default BlogDetail;
