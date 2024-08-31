import React from "react";
import { useNavigate } from "react-router-dom";

const HomeButton = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    const referrer = localStorage.getItem("referrer") || "/"
    console.log(referrer);
    localStorage.removeItem("referrer");
    navigate(referrer);
  };
  
  return (
    <button onClick={handleHomeClick}>Home</button>
  );
}

export default HomeButton;
