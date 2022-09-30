import { CircularProgress } from "@mui/material";
import React from "react";
import "./uploading.css";

const Uploading = () => {
  return (
    <div className="uploading-container">
      <div className="uploading-content">
        <CircularProgress size={40} sx={{ color: "#1f305b" }} />
        <span>Uploading...</span>
      </div>
    </div>
  );
};

export default Uploading;
