import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/Context';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import './profile.css';
import { useNavigate } from 'react-router-dom';
import { database, storage } from '../../firebaseConfig';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { setProfileFilePic } from '../../features/ui/uiSlice';
import {IoMdCloudUpload} from 'react-icons/io'
import { doc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const [image, setImage] = useState(null);
  const auth = getAuth();
  const dispatch = useDispatch()
  const userAuth= useSelector(state => state.auth);
  const navigate = useNavigate();
    const handleSignout = () => {
      signOut(auth).then(res => {
        navigate("/");
        localStorage.clear();
      }).catch(err => console.log(err));
      
  }
  const handleUpload = () => {
    const imageRef = ref(storage, image.name);
    uploadBytes(imageRef, image).then(() => getDownloadURL(imageRef).then(url => {
      const userRef = doc(database,'users', auth.currentUser.uid)
      updateDoc(userRef, {
        "profilePic": url
      }).then(() => console.log("file uploaded")).catch(err => console.log(err));
  
    }).catch(err => console.log(err))
    
    ).catch(err => console.log(err));
  }
    
  return (
      <div className="profile-container">
          <p>{userAuth?.loggedUser?.name?.toUpperCase()}</p>
      <p>{userAuth?.loggedUser?.email}</p>
      <div className="profile-pic-action">
        <label htmlFor="profile"><IoMdCloudUpload title="Choose profile pic" size="30" color="#1f305b" /></label>
        <input type="file" id="profile" onChange={(e) => setImage(e.target.files[0])} style={{ display: "none" }} />
      <button onClick= {handleUpload}>Upload</button>
      </div>
          <button onClick={handleSignout}>Logout</button>
    </div>
  )
}

export default Profile