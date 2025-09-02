// /client/src/components/HeroSlider.jsx
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner'; // Import

function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts?limit=4');
        if (Array.isArray(response.data)) {
          setSlides(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch featured posts:", error);
      } finally {
        setLoading(false); // Set loading to false in both cases
      }
    };
    fetchFeaturedPosts();
  }, []);

  if (loading) {
    // Show a placeholder with a spinner while loading
    return (
      <section id="slider" className="slider section dark-background" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </section>
    );
  }

  if (slides.length === 0) {
    return null; // Don't render if there are no posts
  }

  return (
    <section id="slider" className="slider section dark-background">
      <div className="container" data-aos="fade-up">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          loop={slides.length > 1}
          speed={600}
          autoplay={{ delay: 5000 }}
          slidesPerView="auto"
          centeredSlides={true}
          pagination={{ el: '.swiper-pagination', clickable: true }}
          navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
          className="swiper init-swiper"
        >
          {slides.map(slide => (
            <SwiperSlide 
              key={slide.id} 
              className="swiper-slide" 
              style={{ backgroundImage: `url(${slide.featured_image_url || '/assets/img/post-slide-1.jpg'})` }}
            >
              <div className="content">
                <h2><Link to={`/post/${slide.slug}`}>{slide.title}</Link></h2>
                <p>{slide.excerpt}...</p>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-pagination"></div>
        </Swiper>
      </div>
    </section>
  );
}
export default HeroSlider;