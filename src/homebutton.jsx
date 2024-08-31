import React from "react";
import { useNavigate } from "react-router-dom";

const HomeButton = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };
  
  return (
    <button onClick={handleHomeClick}>Home</button>
  );
}

export default HomeButton;
