// /client/src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchForm from './SearchForm'


// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both sets of data in parallel for efficiency
        const [categoriesRes, recentPostsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/posts?limit=5')
        ]);

        if (Array.isArray(categoriesRes.data)) {
          setCategories(categoriesRes.data);
        }
        if (Array.isArray(recentPostsRes.data)) {
          setRecentPosts(recentPostsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty array means this runs only once

  if (loading) {
    return <div className="sidebar">Loading sidebar...</div>;
  }

  return (
    <div className="sidebar">

      {/* We will make this functional later */}
      <div className="sidebar-item search-form">
        <h3 className="sidebar-title">Search</h3>
        <SearchForm />
      </div>

      {/* Categories Widget */}
      {categories.length > 0 && (
        <div className="sidebar-item categories">
          <h3 className="sidebar-title">Categories</h3>
          <ul className="mt-3">
            {categories.map(category => (
              <li key={category.id}>
                <Link to={`/category/${category.id}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Posts Widget */}
      {recentPosts.length > 0 && (
        <div className="sidebar-item recent-posts-widget">
          <h3 className="sidebar-title">Recent Posts</h3>
          {recentPosts.map(post => (
            <div key={post.id} className="post-item mt-3">
              <img src={post.featured_image_url || '/assets/img/post-landscape-default.jpg'} alt={post.title || ''} className="flex-shrink-0" />
              <div>
                <h4><Link to={`/post/${post.slug}`}>{post.title}</Link></h4>
                <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Sidebar;