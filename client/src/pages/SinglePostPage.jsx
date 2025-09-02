// /client/src/pages/SinglePostPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
// Helper function to format the date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

function SinglePostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { slug } = useParams(); // Get the slug from the URL

  useEffect(() => {
    const fetchPost = async () => {
      // Make sure to reset state on each new slug
      setLoading(true);
      setError("");
      setPost(null);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/posts/${slug}`
        );
        setPost(response.data);
      } catch (err) {
        setError("Post not found or an error occurred.");
        console.error("Fetch single post error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]); // Re-run the effect if the slug changes

 if (loading) {
  return (
    <section className="section">
      <div className="container">
        <LoadingSpinner />
      </div>
    </section>
  );
}

if (error) {
  return (
    <section className="section">
      <div className="container">
        <ErrorMessage message={error} />
      </div>
    </section>
  );
}

if (!post) {
  // This case handles when loading is done but no post was found (e.g., bad slug)
  return (
    <section className="section">
      <div className="container">
        <ErrorMessage message="The post you are looking for could not be found." />
      </div>
    </section>
  );
}
  // Use dangerouslySetInnerHTML to render the HTML from the rich text editor
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <section id="single-post" className="single-post section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="post-meta">
              <span className="date">
                {post.category_name || "Uncategorized"}
              </span>
              <span className="mx-1">•</span>
              <span>{formatDate(post.created_at)}</span>
            </div>
            <h1 className="title">{post.title}</h1>
            <div className="d-flex align-items-center author">
              <div className="photo">
                <img
                  src="/assets/img/person-1.jpg"
                  alt=""
                  className="img-fluid"
                />
              </div>
              <div className="name">
                {/* WRAP THIS H3 WITH A LINK */}
                <Link to={`/author/${post.author_id}`}>
                  <h3 className="m-0 p-0">{post.author_name || "Anonymous"}</h3>
                </Link>
              </div>
            </div>

            {/* This is where the full post content will be rendered */}
            <div
              className="post-content"
              dangerouslySetInnerHTML={createMarkup(post.content)}
            />
          </div>

          <div className="col-lg-4">
            {/* We will build the Sidebar component later and place it here */}
            <div className="sidebar">
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SinglePostPage;
