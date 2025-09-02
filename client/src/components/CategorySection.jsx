// /client/src/components/CategorySection.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// The function name is now 'CategorySection'
function CategorySection({ categoryId, categoryName }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Fetch 10 posts to have enough to fill this complex layout
        const response = await axios.get(`http://localhost:5000/api/posts?categoryId=${categoryId}&limit=10`);
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error(`Failed to fetch posts for ${categoryName}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [categoryId, categoryName]);

  // Divide posts into the groups needed for the "Lifestyle" layout
  const mainPost = posts?.[0];
  const mainPostList = posts?.slice(1, 3) ?? [];
  const gridPosts1 = posts?.slice(3, 6) ?? [];
  const gridPosts2 = posts?.slice(6, 9) ?? [];
  const verticalList = posts?.slice(9) ?? []; // Fallback for the last column

  if (loading) {
    return (
      <section className="category-section section">
        <div className="container"><h2>Loading {categoryName}...</h2></div>
      </section>
    );
  }

  // If there are no posts in this category, don't render anything
  if (!mainPost) {
    return null;
  }

  return (
    // Note: The classes here are matched to the "Lifestyle" section from the template
    <section id={`${categoryName.toLowerCase()}-category`} className="lifestyle-category section">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>{categoryName}</h2>
          <p><Link to={`/category/${categoryId}`} className="m-0">See All {categoryName}</Link></p>
        </div>
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row g-5">
            <div className="col-lg-4">
              {/* Main Post in the Left Column */}
              <div className="post-list lg">
                <Link to={`/post/${mainPost.slug}`}>
                  <img src={mainPost.featured_image_url || 'assets/img/post-landscape-8.jpg'} alt={mainPost.title} className="img-fluid" />
                </Link>
                <div className="post-meta"><span className="date">{mainPost.category_name}</span> <span className="mx-1">•</span> <span>{formatDate(mainPost.created_at)}</span></div>
                <h2><Link to={`/post/${mainPost.slug}`}>{mainPost.title}</Link></h2>
                <p className="mb-4 d-block">{mainPost.excerpt}...</p>
                <div className="d-flex align-items-center author">
                  <div className="photo"><img src="assets/img/person-7.jpg" alt="" className="img-fluid" /></div>
                  <div className="name"><h3 className="m-0 p-0">{mainPost.author_name}</h3></div>
                </div>
              </div>
              {/* List of 2 posts below the main one */}
              {mainPostList.map(post => (
                <div key={post.id} className="post-list border-bottom">
                  <div className="post-meta"><span className="date">{post.category_name}</span> <span className="mx-1">•</span> <span>{formatDate(post.created_at)}</span></div>
                  <h2 className="mb-2"><Link to={`/post/${post.slug}`}>{post.title}</Link></h2>
                  <span className="author mb-3 d-block">{post.author_name}</span>
                </div>
              ))}
            </div>
            <div className="col-lg-8">
              <div className="row g-5">
                <div className="col-lg-4 border-start custom-border">
                  {gridPosts1.map(post => (
                    <div key={post.id} className="post-list">
                      <Link to={`/post/${post.slug}`}><img src={post.featured_image_url || 'assets/img/post-landscape-6.jpg'} alt={post.title} className="img-fluid" /></Link>
                      <div className="post-meta"><span className="date">{post.category_name}</span> <span className="mx-1">•</span> <span>{formatDate(post.created_at)}</span></div>
                      <h2><Link to={`/post/${post.slug}`}>{post.title}</Link></h2>
                    </div>
                  ))}
                </div>
                <div className="col-lg-4 border-start custom-border">
                  {gridPosts2.map(post => (
                    <div key={post.id} className="post-list">
                      <Link to={`/post/${post.slug}`}><img src={post.featured_image_url || 'assets/img/post-landscape-3.jpg'} alt={post.title} className="img-fluid" /></Link>
                      <div className="post-meta"><span className="date">{post.category_name}</span> <span className="mx-1">•</span> <span>{formatDate(post.created_at)}</span></div>
                      <h2><Link to={`/post/${post.slug}`}>{post.title}</Link></h2>
                    </div>
                  ))}
                </div>
                <div className="col-lg-4">
                  {verticalList.map(post => (
                    <div key={post.id} className="post-list border-bottom">
                      <div className="post-meta"><span className="date">{post.category_name}</span> <span className="mx-1">•</span> <span>{formatDate(post.created_at)}</span></div>
                      <h2 className="mb-2"><Link to={`/post/${post.slug}`}>{post.title}</Link></h2>
                      <span className="author mb-3 d-block">{post.author_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// The export name now matches the function and file name
export default CategorySection;