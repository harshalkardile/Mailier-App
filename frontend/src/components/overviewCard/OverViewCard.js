import React from "react";
import "./overViewCard.css";

function OverViewCard({ icon, number, subtitle }) {
  return (
    <div className="overview_card">
      <div className="overview_card__number-badge">{number}</div>
      <div className="overview_card__icon">
        <i className={icon}></i>
      </div>
      <div className="overview_card__info">
        <div className="overview_card_wrap">
          <p className="overview_card__subtitle">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default OverViewCard;