import React from "react";

const HomeButton = () => {
  const referrer = localStorage.getItem("referrer");
  console.log(referrer);
  const handleHomeClick = () => {
    window.location.href = referrer;
  };
  
  if (referrer) {
    return (
      <button onClick={handleHomeClick}>Home</button>
    );
  }
}

export default HomeButton;
