// /client/src/pages/ContactPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setFormStatus('error');
      console.error('Contact form submission error:', error);
    }
  };

  return (
    <section id="contact" className="contact section">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-12 text-center mb-5">
            <h1 className="page-title">Contact</h1>
          </div>
        </div>
        <div className="row gy-4">
          <div className="col-md-4">
            <div className="info-item">
              <i className="bi bi-geo-alt"></i>
              <h3>Address</h3>
              <address>A108 Adam Street, NY 535022, USA</address>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-item">
              <i className="bi bi-telephone"></i>
              <h3>Phone Number</h3>
              <p><a href="tel:+155895548855">+1 5589 55488 55</a></p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-item">
              <i className="bi bi-envelope"></i>
              <h3>Email</h3>
              <p><a href="mailto:info@example.com">info@example.com</a></p>
            </div>
          </div>
        </div>

        <div className="form mt-5">
          <form onSubmit={handleSubmit} className="php-email-form">
            {/* THIS IS THE KEY PART */}
            <div className="row">
              <div className="col-md-6 form-group">
                <input type="text" name="name" className="form-control" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6 form-group">
                <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>
            {/* END KEY PART */}
            
            <div className="form-group">
              <input type="text" className="form-control" name="subject" id="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <textarea className="form-control" name="message" rows="5" placeholder="Message" value={formData.message} onChange={handleChange} required></textarea>
            </div>

            <div className="my-3">
              {formStatus === 'loading' && <div className="loading">Loading</div>}
              {formStatus === 'error' && <div className="error-message" style={{ display: 'block' }}>Something went wrong. Please try again.</div>}
              {formStatus === 'success' && <div className="sent-message" style={{ display: 'block' }}>Your message has been sent. Thank you!</div>}
            </div>
            <div className="text-center">
              <button type="submit" disabled={formStatus === 'loading'}>
                {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;