import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../helpers/AuthContext';
import jwt from 'jsonwebtoken';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [userID, setUserID] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const decodedToken = jwt.decode(token);
        if(token)
        {if (decodedToken) {
          setUserID(decodedToken.userId);
        }
  
        const response = await axios.get(`http://localhost:3001/api/getuserdetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setUserDetails(response.data.userDetails.userDetails); // Updated line
        setLoading(false);
      }
        
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false);
      
        // Log more information about the error
        console.error('AxiosError details:', error.toJSON());
      
        // Handle unauthorized or other errors
        // if (error.response && error.response.status === 401) {
        //   logout();
        //   navigate('/Login');
        // }
    }
  }
  
    fetchUserDetails();
  }, [token, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/Login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <form>
        <label>Email: </label>
        <input type="text" value={userDetails.email} readOnly />
        <br />
        <label>User Info: </label>
        <textarea value={JSON.stringify(userDetails.user_info, null, 2)} readOnly />
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
