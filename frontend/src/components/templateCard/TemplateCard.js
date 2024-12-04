import React, { useState } from 'react';
import './TemplateCard.css';

function TemplateCard({ name, handleDelete, id }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 100;

  // Function to check if text needs truncation
  const needsTruncation = (text) => text.length > MAX_LENGTH;

  // Function to truncate text
  const getTruncatedText = (text) =>
    text.length > MAX_LENGTH ? `${text.substring(0, MAX_LENGTH)}...` : text;

  // Toggle expand/collapse
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="template-card">
      <div className="template-card__icon">
        <i className="fa-solid fa-file"></i>
      </div>
      <div className="template-card__info">
        {name && (
          <p className={`template-card__text ${isExpanded ? 'expanded' : ''}`}>
            {isExpanded ? name : getTruncatedText(name)}
            {needsTruncation(name) && (
              <span
                className="template-card__toggle"
                onClick={toggleExpand}
              >
                {isExpanded ? 'Less' : '...'}
              </span>
            )}
          </p>
        )}
      </div>
      <button
        className="template-card__delete-btn"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>
    </div>
  );
}

export default TemplateCard;
