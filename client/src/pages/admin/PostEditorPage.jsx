// /client/src/pages/admin/PostEditorPage.jsx
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner'; // Ensure path is correct

// --- Style Objects ---
const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' };
const inputStyle = { width: '100%', padding: '10px', fontSize: '16px', boxSizing: 'border-box' };
const selectStyle = { width: '100%', padding: '10px', fontSize: '16px' };
const buttonStyle = { padding: '12px 20px', fontSize: '16px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', alignSelf: 'flex-start' };
const imagePreviewStyle = { marginTop: '15px', maxWidth: '200px', height: 'auto', border: '1px solid #ddd', padding: '5px' };
// --- End Style Objects ---

function PostEditorPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  
  // --- NEW STATE FOR IMAGE UPLOADS ---
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [featuredImagePublicId, setFeaturedImagePublicId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id: postId } = useParams();
  const isEditMode = Boolean(postId);

  const liveApiUrl = 'https://zenblog-live-api.onrender.com'; // Your live API URL

  // Effect for fetching categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${liveApiUrl}/api/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Effect for fetching post data in EDIT mode
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      const fetchPostData = async () => {
        try {
          const response = await axios.get(`${liveApiUrl}/api/posts/id/${postId}`);
          const post = response.data;
          setTitle(post.title);
          setContent(post.content);
          setCategoryId(post.category_id);
          setFeaturedImageUrl(post.featured_image_url || '');
          setFeaturedImagePublicId(post.featured_image_public_id || '');
        } catch (err) {
          setError('Could not load post data for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchPostData();
    }
  }, [isEditMode, postId]);

  // --- NEW: FUNCTION TO HANDLE IMAGE UPLOAD TO CLOUDINARY ---
  const handleImageUpload = async (file) => {
    if (!file) return;
    
    setIsUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    // ❗️ IMPORTANT: Replace with YOUR upload preset name
    formData.append('upload_preset', 'zenblog'); 

    try {
      // ❗️ IMPORTANT: Replace with YOUR cloud name
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dkkdexejr/image/upload`,
        formData
      );
      
      setFeaturedImageUrl(response.data.secure_url);
      setFeaturedImagePublicId(response.data.public_id);
      
    } catch (error) {
      console.error("Image upload failed:", error);
      setError('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // --- UPDATED: handleSubmit to include image data ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title || !content || !categoryId) {
      setError('Please fill in title, content, and category.');
      return;
    }

    const token = localStorage.getItem('authToken');
    const postData = { 
      title, 
      content, 
      category_id: categoryId,
      featured_image_url: featuredImageUrl,
      featured_image_public_id: featuredImagePublicId
    };
    const headers = { 'x-auth-token': token };
    const apiUrl = `${liveApiUrl}/api/posts`;

    try {
      if (isEditMode) {
        await axios.put(`${apiUrl}/${postId}`, postData, { headers });
      } else {
        await axios.post(apiUrl, postData, { headers });
      }
      navigate('/admin/posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post.');
    }
  };

  if (loading && isEditMode) return <LoadingSpinner />;

  return (
    <div>
      <h1>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Title Field */}
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        {/* Category Field */}
        <div>
          <label htmlFor="category_id">Category</label>
          <select id="category_id" style={selectStyle} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Select a Category</option>
            {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>
        
        {/* --- NEW: JSX for Image Upload --- */}
        <div>
          <label htmlFor="image">Featured Image</label>
          <input 
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            style={{ display: 'block', marginTop: '10px' }}
          />
          {isUploading && <p>Uploading image...</p>}
          {featuredImageUrl && (
            <div style={{ marginTop: '15px' }}>
              <p>Image Preview:</p>
              <img src={featuredImageUrl} alt="Featured preview" style={imagePreviewStyle} />
            </div>
          )}
        </div>

        {/* Content Field */}
        <div>
          <label>Content</label>
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        </div>
        
        <button type="submit" style={buttonStyle}>
          {isEditMode ? 'Update Post' : 'Save Post'}
        </button>
      </form>
    </div>
  );
}

export default PostEditorPage;