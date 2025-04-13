import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewsLinks from "./components/NewsLinks";

import Blogs from "./components/Blogs";
import BlogDetail from "./components/BlogDetail";
import Layout from "./components/Layout";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<NewsLinks />} /> {/* Default content */}
        <Route path="news" element={<NewsLinks />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogDetails/:blogId" element={<BlogDetail />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
