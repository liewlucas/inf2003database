import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../helpers/AuthContext'; // Import the useAuth hook

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth(); // Use the useAuth hook to get the logout function

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User not authenticated');
        }

        // Fetch user details from the server using the token
        const response = await axios.get('http://localhost:3001/api/getuserdetails', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserDetails(response.data.userDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    // Clear the token from local storage
    logout(); // Use the logout function from the useAuth hook
    // Redirect to the login page
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
