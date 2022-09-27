import React from 'react'
import { useNavigate } from 'react-router-dom';
import notFound from '../../assets/404.svg'
import './pageNotFound.css'

const PageNotFound = () => {
    const navigate = useNavigate();

  const goBack = () => navigate(-1);
  return (
      <div className="pnf-container">
          <h2 className="pnf-title">Page Not Found</h2>
          <img className="pnf-img " src={notFound} alt="not found" />
          <p>Page doesn't exist.</p>
     
           <button  onClick={goBack}>Go Back</button>
    </div>
  )
}

export default PageNotFound