// /client/src/components/TrendingSection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner'; // Import
import ErrorMessage from './ErrorMessage';   // Import

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function TrendingSection() {
 const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Add error state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch up to 12 posts for this complex section
        const response = await axios.get('http://localhost:5000/api/posts?limit=12');
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch posts for Trending Section:", error);
        setError("Could not load trending posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Safely divide the posts into different layout groups
  const featuredPost = posts?.[0]; // The first post is featured
  const middlePosts1 = posts?.slice(1, 4) ?? [];
  const middlePosts2 = posts?.slice(4, 7) ?? [];
  const trendingList = posts?.slice(7, 12) ?? [];

  if (loading) {
    return (
      <section className="trending-category section">
        <div className="container"><LoadingSpinner /></div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="trending-category section">
        <div className="container"><ErrorMessage message={error} /></div>
      </section>
    );
  }

  // If there are no posts at all, don't render this section
  if (!featuredPost) {
    return null;
  }

  return (
    <section id="trending-category" className="trending-category section">
      <div className="container" data-aos="fade-up">
        <div className="row g-5">
          
          {/* --- Left Column: Large Featured Post --- */}
          <div className="col-lg-4">
            <div className="post-entry lg">
              <Link to={`/post/${featuredPost.slug}`}>
                <img src={featuredPost.featured_image_url || 'assets/img/post-landscape-1.jpg'} alt={featuredPost.title} className="img-fluid" />
              </Link>
              <div className="post-meta">
                <span className="date">{featuredPost.category_name || 'N/A'}</span>
                <span className="mx-1">•</span>
                <span>{formatDate(featuredPost.created_at)}</span>
              </div>
              <h2><Link to={`/post/${featuredPost.slug}`}>{featuredPost.title}</Link></h2>
              <p className="mb-4 d-block">{featuredPost.excerpt}...</p>
              <div className="d-flex align-items-center author">
                <div className="photo"><img src="assets/img/person-1.jpg" alt="" className="img-fluid" /></div>
                <div className="name"><h3 className="m-0 p-0">{featuredPost.author_name || 'N/A'}</h3></div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Grid and Trending List --- */}
          <div className="col-lg-8">
            <div className="row g-5">
              {/* Middle Column 1 */}
              <div className="col-lg-4 border-start custom-border">
                {middlePosts1.map(post => (
                  <div key={post.id} className="post-entry">
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.featured_image_url || 'assets/img/post-landscape-2.jpg'} alt={post.title} className="img-fluid" />
                    </Link>
                    <div className="post-meta"><span className="date">{post.category_name || 'N/A'}</span><span className="mx-1">•</span><span>{formatDate(post.created_at)}</span></div>
                    <h2><Link to={`/post/${post.slug}`}>{post.title}</Link></h2>
                  </div>
                ))}
              </div>
              
              {/* Middle Column 2 */}
              <div className="col-lg-4 border-start custom-border">
                {middlePosts2.map(post => (
                  <div key={post.id} className="post-entry">
                    <Link to={`/post/${post.slug}`}><img src={post.featured_image_url || 'assets/img/post-landscape-3.jpg'} alt={post.title} className="img-fluid" /></Link>
                    <div className="post-meta"><span className="date">{post.category_name || 'N/A'}</span><span className="mx-1">•</span><span>{formatDate(post.created_at)}</span></div>
                    <h2><Link to={`/post/${post.slug}`}>{post.title}</Link></h2>
                  </div>
                ))}
              </div>

              {/* Trending List Column (only renders if there are items for it) */}
              {trendingList.length > 0 && (
                <div className="col-lg-4">
                  <div className="trending">
                    <h3>Trending</h3>
                    <ul className="trending-post">
                      {trendingList.map((post, index) => (
                        <li key={post.id}>
                          <Link to={`/post/${post.slug}`}>
                            <span className="number">{index + 1}</span>
                            <h3>{post.title}</h3>
                            <span className="author">{post.author_name || 'N/A'}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default TrendingSection;