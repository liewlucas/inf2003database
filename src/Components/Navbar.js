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
  const { token, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [userType, setUserType] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userID, setUserID] = useState(null);
  let isDealer = false;

  useEffect(() => {
    // Update the isLoggedIn state when the token changes
    setIsLoggedIn(!!token);

    // Decode the token and extract user type
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken) {
        setUserID(decodedToken.userId);
        setUserType(decodedToken.type);
        setUserEmail(decodedToken.email);
      }
    }
  }, [token]);

  if (userType === 'dealer') {
    isDealer = true;
  }

  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  const handleLogout = () => {
    // Call the logout function from useAuth context
    logout();
    // Redirect to the home page after logout
    window.location.href = "/Login";
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
        {isLoggedIn && isDealer && <Link to="/PostsDealerAdd"> Add Post </Link>}
        {isLoggedIn && isDealer && <Link to="/PostsDealer"> Post Dealer </Link>}
        {!isLoggedIn && <Link to="/Register"> Register </Link>}
        
        {/* Display the user's email beside the profile picture */}
        {isLoggedIn && (<div className="user-info"><AccountCircleIcon /></div>)}
        {isLoggedIn && <text className="email">{userEmail}</text>}
        {/* Add logout link */}
        {isLoggedIn && <Link to="/" onClick={handleLogout}> Logout </Link>}

  
        

        <button onClick={toggleNavbar}>
          <ReorderIcon />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
