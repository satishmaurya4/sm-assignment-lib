import React, { useEffect, useState } from "react";
import { MdComputer } from "react-icons/md";
import { useDispatch } from "react-redux";
import {alert} from '../../../features/ui/uiSlice'


const FileInput = ({ getFile }) => {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
    // console.log(data);
      getFile(data);
  useEffect(() => {
    if (data) {
      dispatch(alert({status: 'success', message: `You have choosen ${data?.name} file!`, isOpen:true }))
          
        }
  },[data])
  return (
    <>
      <label htmlFor="fileInput">
        <MdComputer
          size="30"
          className="assignment-icon"
          title="Choose from computer"
        />
      </label>
      <input
        type="file"
        id="fileInput"
        onChange={(e) => setData(e.target.files[0])}
        name="file"
        style={{ display: "none" }}
      />
    </>
  );
};

export default FileInput;
