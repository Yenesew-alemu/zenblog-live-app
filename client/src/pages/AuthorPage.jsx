// /client/src/pages/AuthorPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';

function AuthorPage() {
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id: authorId } = useParams(); // Get the author ID from the URL

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!authorId) return;

      setLoading(true);
      try {
        // Fetch author details and their posts in parallel
        const [authorRes, postsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${authorId}`),
          axios.get(`http://localhost:5000/api/users/${authorId}/posts`)
        ]);
        
        setAuthor(authorRes.data);
        setPosts(postsRes.data);

      } catch (err) {
        setError('Could not fetch author data. The author may not exist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorId]); // Re-run if the authorId in the URL changes

  const renderContent = () => {
    if (loading) return <p>Loading author profile...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!author) return <p>Author not found.</p>;

    return (
      <>
        {/* Author Bio Section */}
        <div className="section-title">
          <h2>{author.username}</h2>
          <p>{author.bio || 'This author has not provided a bio yet.'}</p>
        </div>

        {/* Grid of Author's Posts */}
        <div className="row g-5">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="col-lg-6">
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <p>This author has not published any posts yet.</p>
          )}
        </div>
      </>
    );
  };

  return (
    <section className="author-section section">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-8">
            {renderContent()}
          </div>
          <div className="col-lg-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthorPage;