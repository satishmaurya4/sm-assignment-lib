import React from 'react'
import { useDispatch } from 'react-redux'
import './deleteDialouge.css'
import { deleteCourse, handleDD } from './uiSlice';
const DeleteDialouge = ({ deleteC }) => {
    const dispatch = useDispatch();
    
  return (
      <div className='dd-wrapper'>
          <div className="dd-container">
              <p className="ddTitle">Are you sure? You want to delete <span style={{textDecoration: 'underline', textTransform: 'uppercase'}}>{`${deleteC} `}</span> course!</p>
              <div className="ddFooter">
                  <button className="btn btn-cancel" onClick={()=>dispatch(handleDD(false))}>Cancel</button>
                  <button className="btn" onClick={() => {
                      dispatch(deleteCourse(true))
                      dispatch(handleDD(false))
                  }
                  }>Confirm</button>
              </div>
          </div>
    </div>
  )
}

export default DeleteDialouge