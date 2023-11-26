import React, { useState, useEffect } from "react";
import Logo from "../assets/carlogo.png";
import { Link } from "react-router-dom";
import ReorderIcon from '@mui/icons-material/Reorder';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "../styles/Navbar.css";
import { useAuth } from '../helpers/AuthContext';

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);
  const { token, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    // Update the isLoggedIn state when the token changes
    setIsLoggedIn(!!token);
  }, [token]);

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
        <Link to="/Posts"> Posts </Link>
        {isLoggedIn && <Link to="/PostsDealerAdd"> Add Post </Link>}
        {isLoggedIn && <Link to="/PostsDealer"> Post Dealer </Link>}
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
