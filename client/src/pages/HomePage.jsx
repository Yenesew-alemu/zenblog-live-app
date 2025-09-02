// /client/src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSlider from '../components/HeroSlider';
import TrendingSection from '../components/TrendingSection';
import CategorySection from '../components/CategorySection'; // We now only import our one standard component

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories for homepage:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <HeroSlider />
      <TrendingSection />
      
      {/* 
        This is now very simple. It loops through all categories
        and renders the same beautiful layout for each one.
      */}
      {!loading && categories.map(category => (
        <CategorySection 
          key={category.id} 
          categoryId={category.id} 
          categoryName={category.name} 
        />
      ))}
    </>
  );
}

export default HomePage;