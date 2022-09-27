import React from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { userCollectionRef } from "../../firebaseConfig";
import "./auth.css";
import { useState } from "react";
import { query, where, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { MdLocalLibrary } from "react-icons/md";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { alert, loading } from "../ui/uiSlice";
import { getLoggedUser } from "./authSlice";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useEffect } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ui = useSelector((state) => state.ui);
  console.log("showPassword", showPassword);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(loading(true));
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        console.log("current user id", auth.currentUser.uid);
        const uidQuery = query(
          userCollectionRef,
          where("uid", "==", auth.currentUser.uid)
        );
        console.log("sing in ");
        dispatch(
          alert({
            status: "success",
            message: "Logged in successfully!",
            isOpen: true,
          })
        );
        onSnapshot(uidQuery, (data) => {
          const loggedUser = data.docs.map((item) => {
            return item.data();
          });
          dispatch(loading(false));
          dispatch(getLoggedUser({ ...loggedUser[0] }));
          localStorage.setItem("user", JSON.stringify({ ...loggedUser[0] }));
          navigate("/home/dashboard");
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        dispatch(
          alert({
            status: "error",
            message: "Please enter valid credentials!",
            isOpen: true,
          })
        );
      });
  };

  useEffect(() => {
    if (!password) {
      setPasswordIcon(false);
    } else {
      setPasswordIcon(true);
    }
  }, [password]);

  return (
    <div className="login-wrapper">
      <div className="form-wrapper">
        <img src={logo} alt="loog" className="form-logo" />
        <div className="login-content">
          <div className="login-left">
            <h4 className="login-title">Assignment Library</h4>
            <MdLocalLibrary size="80" color="#1f305b" />
          </div>
          <form className="form" onSubmit={submitHandler}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordIcon ? (
                  showPassword ? (
                    <VisibilityIcon
                      onClick={() => setShowPassword(false)}
                      sx={{ color: "gray" }}
                    />
                  ) : (
                    <VisibilityOffIcon
                      onClick={() => setShowPassword(true)}
                      sx={{ color: "gray" }}
                    />
                  )
                ) : null}
              </div>
            </div>
            <button type="submit">
              {ui.isLoading ? (
                <CircularProgress size={20} sx={{ color: "#00dadb" }} />
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
