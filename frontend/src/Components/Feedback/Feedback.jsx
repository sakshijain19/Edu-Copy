/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";

const FeedbackSection = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Feedback Submitted! Rating: ${rating}, Feedback: ${feedback}`); // Replace with actual submission logic
  };

  return (
    <div 
      className="feedback-container"
      style={{
        backgroundImage: "url('https://img.freepik.com/free-vector/service-rating-customer-feedback-concept_107791-17032.jpg?semt=ais_hybrid')", // Placeholder image
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div 
        className="feedback-form"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "rgba(255, 255, 255, 0.9)", // Slight transparency
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
          width: "400px",
          textAlign: "center"
        }}
      >
        <h2>Give Your Feedback</h2>
        <div style={{ margin: "10px 0" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span 
              key={star} 
              onClick={() => setRating(star)}
              style={{
                fontSize: "24px",
                cursor: "pointer",
                color: rating >= star ? "#ffcc00" : "#ccc", // Filled star color
                transition: "color 0.2s"
              }}
            >
              ★
            </span>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Enter your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginBottom: "10px"
            }}
            required
          />
          <button 
            type="submit" 
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default FeedbackSection;