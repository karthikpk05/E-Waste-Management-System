// // RecyclingBackground.jsx
import React from "react";
import recycleIcon from "../assets/recycle.png"; // ✅ add your recycle SVG/logo in assets

const RecyclingBackground = () => {
  return (
    <div className="recycling-background">
      <div className="recycling-watermark1">♻️</div>
      <div className="recycling-watermark2">♻️</div>

      {/* Floating recycle icons */}
      <img src={recycleIcon} alt="recycle" className="recycle-icon icon1" />
      <img src={recycleIcon} alt="recycle" className="recycle-icon icon2" />
      <img src={recycleIcon} alt="recycle" className="recycle-icon icon3" />
      <img src={recycleIcon} alt="recycle" className="recycle-icon icon4" />
      <img src={recycleIcon} alt="recycle" className="recycle-icon icon5" />
    </div>
  );
};

export default RecyclingBackground;


