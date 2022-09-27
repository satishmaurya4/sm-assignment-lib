import { padding } from '@mui/system';
import React, { useEffect, useState } from 'react'

const AdminRemarks = ({ getRemarks }) => {
  const [data, setData] = useState('');
  console.log("remarks", data);
  useEffect(() => {
    getRemarks(data);
    
  },[data])
  return (
    <input type="text" onChange={(e) => setData(e.target.value)} style={{ height: '30px', paddingLeft: '5px', outline: 'none', borderRadius:'5px',border: '1px solid gray'}} />
  )
}

export default AdminRemarks