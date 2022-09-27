import React, { useContext, useState } from 'react'
import { useAppState, UserContext } from '../../context/Context';
import { currentTime } from '../../utils/currentTime';
import './header.css'
import { FaUserCircle } from 'react-icons/fa';
import Profile from '../profile/Profile';
import {useSelector} from 'react-redux'


const Header = () => {
  const [open, setOpen] = useState(false);
  const auth = useSelector(state => state.auth.loggedUser);
  // const ui = useSelector(state => state.ui);
  // const { dispatch, globalState } = useContext(UserContext);
  // const { storedUser } = useAppState();
  // const role = globalState.user[0].role;
  
  // let content;
  // if (!globalState) {
  //   console.log(globalState)
  //   content = <p>Loading...</p>
  // } else {
  //   console.log(globalState)
  //   // const {name, role, email, active} = globalState.user[0]
  //   // content = <>
  //   // <p>Good morning, {name.toUpperCase()}</p>
  //   //       <button className='btn'>Profile</button>
  //   // </>
  // }
  // console.log("header globalState" + globalState);
  // console.log("profile pic url", ui.profilePicUrl);
  // onMouseLeave={()=> setOpen(false)}

  return (
      <div className="header">
      <h2 className="header-title">{currentTime()}, {auth?.name?.toUpperCase()}</h2>
      <div className='profile-icon-container' onBlur={()=> setOpen(false)}>
        {
          auth?.profilePic ? <div className="profile-img-container"><img className="profile-img" src={auth?.profilePic} alt="profile pic"  onClick={() => setOpen(!open)} /> </div>: 
        <FaUserCircle color="#1f305b" size="30" className='header-profile-icon' onClick={() => setOpen(!open)} />
        }
        
        {
          open && <Profile />
        }

      </div>
    </div>
  )
}

export default Header