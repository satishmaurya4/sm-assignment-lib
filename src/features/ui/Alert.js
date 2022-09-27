import React from 'react'
import {useSelector} from 'react-redux'
import './alert.css'
const Alert = () => {
    const {alertInfo:{status,message}} = useSelector(state => state.ui);
    // const {globalState} = useContext(UserContext)
    // console.log("&&",{...alert} )
    // const obj = JSON.parse(JSON.stringify(alert))
    // console.log(obj.message);
    // console.log(globalState.alert.status);
//     const { alert: { status, message } } = globalState;
    const style = {
        backgroundColor: status === 'success' ? 'green' : 'red',
        color: status === 'success' ? 'lime' : 'pink'
}

  return (
      <div className="alert-container" style={style}>
          <p>{message}</p>
    </div>
  )
}

export default Alert