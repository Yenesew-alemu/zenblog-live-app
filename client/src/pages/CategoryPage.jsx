// /client/src/pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner'; // Import
import ErrorMessage from '../components/ErrorMessage';   // Import

function CategoryPage() {
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id: categoryId } = useParams();

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/posts?categoryId=${categoryId}`);
        if (Array.isArray(response.data)) {
          setPosts(response.data);
          if (response.data.length > 0) {
            setCategoryName(response.data[0].category_name);
          } else {
            // Fetch category name separately if there are no posts
            const catResponse = await axios.get(`http://localhost:5000/api/categories/${categoryId}`); // Assumes this endpoint exists
            setCategoryName(catResponse.data.name);
          }
        }
      } catch (err) {
        setError('Could not fetch posts for this category.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [categoryId]);

  const renderContent = () => {
    if (posts.length === 0) {
      return <p>There are no posts in this category yet.</p>;
    }
    return posts.map(post => (
      <div key={post.id} className="col-lg-6"><PostCard post={post} /></div>
    ));
  };

  return (
    <section className="category-section section">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>{categoryName}</h2>
        </div>
        <div className="row">
          <div className="col-lg-8">
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!loading && !error && (
              <div className="row g-5">
                {renderContent()}
              </div>
            )}
          </div>
          <div className="col-lg-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </section>
  );
}
export default CategoryPage;