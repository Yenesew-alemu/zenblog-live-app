// /client/src/pages/admin/ManageCategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Style Objects ---
const pageStyle = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' };
const formContainerStyle = { padding: '20px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' };
const listStyle = { listStyle: 'none', padding: 0 };
const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px',
  border: '1px solid #ddd',
  marginBottom: '10px',
  borderRadius: '4px',
  backgroundColor: 'white',
};
const buttonStyle = {
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
};
const createButtonStyle = { ...buttonStyle, width: '100%', marginTop: '10px', backgroundColor: '#198754', color: 'white', fontWeight: 'bold' };
const deleteButtonStyle = { ...buttonStyle, backgroundColor: '#dc3545', color: 'white' };
const inputStyle = { width: '100%', padding: '10px', boxSizing: 'border-box', fontSize: '16px' };
// --- End Style Objects ---

function ManageCategoriesPage() {
  // --- State Definitions ---
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // --- Reusable function to fetch all categories ---
  const fetchCategories = async () => {
    try {
      setLoading(true); // Show loading indicator
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
      setError(''); // Clear previous errors on success
    } catch (err) {
      setError('Failed to fetch categories.');
      console.error(err);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // --- Effect to fetch categories when the component first loads ---
  useEffect(() => {
    fetchCategories();
  }, []); // Empty array ensures this runs only once

  // --- Handler for creating a new category ---
  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    if (!newCategoryName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:5000/api/categories',
        { name: newCategoryName },
        { headers: { 'x-auth-token': token } }
      );
      
      setNewCategoryName(''); // Clear the input field on success
      fetchCategories(); // Re-fetch the list to show the newly added category
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category.');
      console.error('Create Category Error:', err);
    }
  };

  // --- Handler for deleting a category ---
  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    setError(''); // Clear previous errors

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/categories/${categoryId}`, {
        headers: { 'x-auth-token': token }
      });

      // Update UI by filtering out the deleted category
      setCategories(currentCategories => currentCategories.filter(cat => cat.id !== categoryId));
    } catch (err) {
      setError('Failed to delete category.');
      console.error('Delete Category Error:', err);
    }
  };

  // --- Conditional Rendering ---
  if (loading) return <div>Loading categories...</div>;

  // --- JSX Render ---
  return (
    <div>
      <h1>Manage Categories</h1>
      
      {/* Display error message if any exists */}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <div style={pageStyle}>
        {/* Column 1: List of existing categories */}
        <div>
          <h2>Existing Categories</h2>
          {categories.length > 0 ? (
            <ul style={listStyle}>
              {categories.map(cat => (
                <li key={cat.id} style={listItemStyle}>
                  <span>{cat.name}</span>
                  <button onClick={() => handleDelete(cat.id)} style={deleteButtonStyle}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No categories found. Add one to get started!</p>
          )}
        </div>
        
        {/* Column 2: Form to add a new category */}
        <div style={formContainerStyle}>
          <h2>Add New Category</h2>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              style={inputStyle}
            />
            <button type="submit" style={createButtonStyle}>
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ManageCategoriesPage;