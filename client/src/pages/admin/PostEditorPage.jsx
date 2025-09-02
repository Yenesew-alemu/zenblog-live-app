// /client/src/pages/admin/PostEditorPage.jsx
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // The Quill editor's styles
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// --- Style Objects ---
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  marginTop: '20px',
};
const inputStyle = { 
  width: '100%',
  padding: '10px', 
  fontSize: '16px',
  boxSizing: 'border-box' 
};
const selectStyle = { 
  width: '100%',
  padding: '10px', 
  fontSize: '16px' 
};
const buttonStyle = {
  padding: '12px 20px',
  fontSize: '16px',
  backgroundColor: '#0d6efd',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  alignSelf: 'flex-start',
};
// --- End Style Objects ---

function PostEditorPage() {
  // --- This is where ALL state and hooks should be defined ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // For loading state
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [featuredImagePublicId, setFeaturedImagePublicId] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();
  const { id: postId } = useParams(); // Get the post ID from the URL parameter
  const isEditMode = Boolean(postId); // Check if we are in "edit" mode

  // --- Effect 1: Fetch Categories for the dropdown ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
        setError('Could not load categories. Please try again.');
      }
    };
    fetchCategories();
  }, []); // Runs once when the component mounts

  // --- Effect 2: Fetch Existing Post Data for Editing ---
  useEffect(() => {
    // This effect only runs if we are in "edit mode"
    if (isEditMode) {
      setLoading(true); // Start loading state
      const fetchPostData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/posts/id/${postId}`);
          const post = response.data;
          
          // Populate the form fields with the fetched data
          setTitle(post.title);
          setContent(post.content);
          setCategoryId(post.category_id);
          setFeaturedImageUrl(post.featured_image_url || '');
        setFeaturedImagePublicId(post.featured_image_public_id || '');
        } catch (err) {
          console.error('Failed to fetch post data', err);
          setError('Could not load the post data for editing.');
        } finally {
          setLoading(false); // Stop loading state
        }
      };
      fetchPostData();
    }
  }, [isEditMode, postId]); // Runs if the mode or ID changes

  const handleImageUpload = async (file) => {
  if (!file) return;
  
  setIsUploading(true);
  const formData = new FormData();
  formData.append('file', file);
  // Replace with YOUR upload preset name from Cloudinary settings
  formData.append('upload_preset', 'zenblog'); 

  try {
    // Replace with YOUR cloud name from Cloudinary dashboard
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dkkdexejr/image/upload`,
      formData
    );
    
    // Cloudinary sends back all the image info
    setFeaturedImageUrl(response.data.secure_url);
    setFeaturedImagePublicId(response.data.public_id);
    
  } catch (error) {
    console.error("Image upload failed:", error);
    setError('Image upload failed. Please try again.');
  } finally {
    setIsUploading(false);
  }
};

  // --- Function: Handle Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !content || !categoryId) {
      setError('Please fill in all fields.');
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

    try {
      if (isEditMode) {
        // UPDATE Logic
        await axios.put(`http://localhost:5000/api/posts/${postId}`, postData, { headers });
      } else {
        // CREATE Logic
        await axios.post('http://localhost:5000/api/posts', postData, { headers });
      }
      navigate('/admin/posts'); // Redirect back to the list on success
  // The new, improved catch block
} catch (err) {
  // Check if the server sent a specific error message.
  // The '?' are optional chaining, preventing errors if 'response' or 'data' don't exist.
  const serverErrorMessage = err.response?.data?.message;

  if (serverErrorMessage) {
    // If we got a specific message from the server, display it.
    setError(serverErrorMessage);
  } else {
    // Otherwise, show a generic message.
    const action = isEditMode ? 'update' : 'create';
    setError(`Failed to ${action} post. Please try again.`);
  }
  
  console.error(err); // Always log the full error for debugging
}
  };

  // While fetching data in edit mode, show a loading message
  if (loading) {
    return <div>Loading editor...</div>;
  }

  // --- JSX for rendering the component ---
  return (
    <div>
      <h1>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            style={inputStyle}
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="category_id">Category</label>
          <select
            id="category_id"
            style={selectStyle}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
  <label htmlFor="image">Featured Image</label>
  <input 
    type="file"
    id="image"
    accept="image/*" // Only allow image files
    onChange={(e) => handleImageUpload(e.target.files[0])}
    style={{ display: 'block', marginTop: '10px' }}
  />
  {isUploading && <p>Uploading image...</p>}
  {/* Image Preview */}
  {featuredImageUrl && (
    <div style={{ marginTop: '15px' }}>
      <img src={featuredImageUrl} alt="Featured preview" style={{ maxWidth: '200px', height: 'auto' }} />
    </div>
  )}
</div>

        <div>
          <label>Content</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            style={{ backgroundColor: 'white' }}
          />
        </div>
        
        <button type="submit" style={buttonStyle}>
          {isEditMode ? 'Update Post' : 'Save Post'}
        </button>
      </form>
    </div>
  );
}

export default PostEditorPage;