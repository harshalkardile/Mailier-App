import React from "react";
import "./groupcard.css";

function GroupCard({ name, emails, handleDelete, id }) {
  return (
    <div>
      <div class='card'>
        <div class='card__icon'>
          <i class='fa fa-users'></i>
        </div>
        <div class='card__info'>
          <h2 class='card__title'>{name}</h2>
          <p class='card__subtitle'>Number of Emails</p>
          <p class='card__number'>{emails}</p>
        </div>
        <button
        className="template-card__delete-btn"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>
      </div>
    </div>
  );
}

export default GroupCard;
