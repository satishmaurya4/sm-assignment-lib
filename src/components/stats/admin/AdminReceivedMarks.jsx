
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const AdminReceivedMarks = ({getReceivedMarks}) => {
  // const {uiIsAssignmentChecked} = useSelector(state => state.ui)
  const [marks, setMarks] = useState('');

  useEffect(() => {
    getReceivedMarks(marks);
  },[marks])
  return (
    <input type="text" onChange={(e)=> setMarks(e.target.value)} className='received-marks-input' style={{width: '30px', height: '30px', textAlign: 'center', lineHeight: '30px',outline: 'none',border:'1px solid gray',borderRadius:'5px'}}/>
  )
}

export default AdminReceivedMarks