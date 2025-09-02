// /client/src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';

function SearchResultsPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // Get the value of 'q' from the URL

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/search?q=${query}`);
        setSearchResults(response.data);
      } catch (err) {
        setError('Failed to fetch search results.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]); // Re-run the search whenever the 'q' parameter in the URL changes

  const renderContent = () => {
    if (loading) return <p>Searching...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (searchResults.length === 0) return <p>No results found for "<strong>{query}</strong>".</p>;

    return searchResults.map(post => (
      <div key={post.id} className="col-lg-6">
        <PostCard post={post} />
      </div>
    ));
  };

  return (
    <section className="search-result section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <h3 className="category-title">Search Results for: {query}</h3>
            <div className="row g-5">
              {renderContent()}
            </div>
          </div>
          <div className="col-lg-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchResultsPage;