import React, { useState, useEffect } from "react";
import Logo from "../assets/carlogo.png";
import { Link } from "react-router-dom";
import ReorderIcon from '@mui/icons-material/Reorder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "../styles/Navbar.css";
import { useAuth } from '../helpers/AuthContext';
import jwt from 'jsonwebtoken';


function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);
  const {token} = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [userType, setUserType] = useState(null);
  const [userID, setUserID] = useState(null);
  let isDealer = false;

  useEffect(() => {
    // Update the isLoggedIn state when the token changes
  //   setIsLoggedIn(!!token);
  // }, [token]);

  // Update the isLoggedIn state when the token changes
  setIsLoggedIn(!!token);

  // Decode the token and extract user type
  if (token) {
    const decodedToken = jwt.decode(token);
    if (decodedToken) {
      setUserID(decodedToken.userId)
      console.log("USER ID: ", decodedToken.userId)
      console.log("USER TYPE: ", decodedToken.type)
      setUserType(decodedToken.type);
    }
  }
}, [token]);

  if(userType == 'dealer')
  {
    isDealer = true;
  }

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };
  
  return (
    <div className="navbar">
      <div className="leftSide" id={openLinks ? "open" : "close"}>
        <img src={Logo} alt="logo" />
        <div className="hiddenLinks">
          <Link to="/"> Home </Link>
          {!isLoggedIn && <Link to="/Login"> Login </Link>}
          <Link to="/Posts"> Posts </Link>
        </div>
      </div>
      <div className="rightSide">
        <Link to="/"> Home </Link>
        {!isLoggedIn && <Link to="/Login"> Login </Link>}
        {(!isLoggedIn || isLoggedIn) && !isDealer && <Link to="/Posts"> Posts </Link>}
        {isLoggedIn  && isDealer && <Link to="/PostsDealerAdd"> Add Post </Link>}
        {isLoggedIn && isDealer && <Link to="/PostsDealer"> Post Dealer </Link>}
        {!isLoggedIn && <Link to="/Register"> Register </Link>}
        {isLoggedIn && <Link to="/Profile"> <AccountCircleIcon /></Link>}
        <button onClick={toggleNavbar}>
          <ReorderIcon />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
