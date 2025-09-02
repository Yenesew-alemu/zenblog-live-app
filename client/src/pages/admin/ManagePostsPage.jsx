// /client/src/pages/admin/ManagePostsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// --- Style Objects ---
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};
const thTdStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  textAlign: 'left',
};
const thStyle = {
  ...thTdStyle,
  backgroundColor: '#f8f9fa',
  fontWeight: 'bold',
};
const actionsCellStyle = {
  ...thTdStyle,
  width: '150px',
  textAlign: 'center',
};
const buttonStyle = {
  padding: '6px 12px',
  margin: '0 5px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  textDecoration: 'none', // For Link styled as a button
  display: 'inline-block', // For Link styled as a button
};
const editButtonStyle = { ...buttonStyle, backgroundColor: '#0d6efd', color: 'white' };
const deleteButtonStyle = { ...buttonStyle, backgroundColor: '#dc3545', color: 'white' };
const createButtonStyle = {
  display: 'inline-block',
  padding: '10px 20px',
  backgroundColor: '#198754',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '5px',
  marginBottom: '20px',
  fontWeight: 'bold',
};
// --- End Style Objects ---


function ManagePostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []); // The empty array ensures this effect runs only once

  // Handle post deletion
  const handleDelete = async (postId) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication error. Please log in again.');
        return;
      }

      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: { 'x-auth-token': token }
      });

      // Update UI instantly by filtering out the deleted post
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));

    } catch (err) {
      setError('Failed to delete the post. Please try again.');
      console.error('Delete error:', err);
    }
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    
    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {/* ... your existing table JSX ... */}
      </table>
    );
  };
  // Main component render
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Manage Posts</h1>
        <Link to="/admin/posts/new" style={createButtonStyle}>Create New Post</Link>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Author</th>
            <th style={thStyle}>Actions</th> {/* CORRECTED HEADER */}
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map(post => (
              <tr key={post.id}>
                <td style={thTdStyle}>{post.title}</td>
                <td style={thTdStyle}>{post.category_name || 'N/A'}</td>
                <td style={thTdStyle}>{post.author_name || 'N/A'}</td>
                <td style={actionsCellStyle}>
                  <Link to={`/admin/posts/edit/${post.id}`} style={editButtonStyle}>Edit</Link>
                  <button onClick={() => handleDelete(post.id)} style={deleteButtonStyle}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                No posts found. Why not create one?
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManagePostsPage;