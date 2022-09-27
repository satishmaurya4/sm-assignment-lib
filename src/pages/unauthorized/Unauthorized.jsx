import React from "react";
import { useNavigate } from "react-router-dom";
import unAuth from "../../assets/unauth.svg";
import './unauthorized.css'
const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);
  return (
    <div className="unAuth-container">
      <h2 className="unAuth-title">Unauthorized</h2>
          <img className="unAuth-img" src={unAuth} alt="unauthorized" />
          <p>You do not have access to the requested page.</p>
          
          <button  onClick={goBack}>Go Back</button>
    </div>
  );
};

export default Unauthorized;
