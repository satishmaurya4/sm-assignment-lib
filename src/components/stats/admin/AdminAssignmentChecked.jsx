import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setToggleUiIsAssignmentChecked, setUiIsAssignmentChecked } from "../../../features/ui/uiSlice";

const AdminAssignmentChecked = ({uploaded, checkedStatus}) => {
  const [openOptions, setOpenOptions] = useState(false);
    const [optionValue, setOptionValue] = useState("false");
    
    const dispatch = useDispatch();
    // const { uiIsAssignmentChecked, toggleUiIsAssignmentChecked } = useSelector(state => state.ui);
    useEffect(() => {
        checkedStatus(optionValue);
        
    },[optionValue])

  const handleAssignmentChecked = (status) => {
    if (status === "true") {
        setOptionValue("true");
        setOpenOptions(false);
   
        
    } else {
        setOptionValue("false");
        setOpenOptions(false);

    }
  };

  return (
    <div className="asst-checked-container" style={{position: 'relative'}}>
      <p
        className="asst-checked-toggle"
              onClick={() => setOpenOptions(!openOptions)}
              style={{ display: 'flex', justifyContent: 'space-between',alignItems: 'center', gap: '5px', textTransform: 'capitalize', cursor: 'pointer', backgroundColor: "#1f305b", color: "#fff", padding: '5px',borderRadius: '5px'}}
      >
        {optionValue}
       {openOptions ? <MdKeyboardArrowUp />:<MdKeyboardArrowDown /> } 
      </p>
      {openOptions && uploaded ? (
        <div className="asst-options" style={{position: 'absolute', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)', borderRadius: '5px', padding: '5px', width: '100%', zIndex: 2,backgroundColor: '#fff'}}>
          <p onClick={() => handleAssignmentChecked("true")} style={{cursor: 'pointer'}}>True</p>
          <p onClick={() => handleAssignmentChecked("false")} style={{cursor: 'pointer'}}>False</p>
        </div>
      ):null}
    </div>
  );
};

export default AdminAssignmentChecked;
