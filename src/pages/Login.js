import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import '../styles/Login.css'; // Import the CSS file
import Logo from "../assets/loginlogo.png";
import { useAuth } from '../helpers/AuthContext'; // Import the useAuth hook

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth(); // Use the useAuth hook to get the login function
  const navigate = useNavigate(); // Initialize useNavigate from React Router

  // const handleLogin = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:3001/api/login', { email, password });
  //     console.log(response.data); // handle success (response from server)
  //     const { token } = response.data;

  //     login(token); // Use the login function from the context to set the token

  //      // Store the token in local storage
  //      //localStorage.setItem('token', token);

  //     // Set the success message
  //     setSuccessMessage('Login successful! Redirecting to the home page...');

  //     // Redirect to the home page after a brief delay
  //     setTimeout(() => {
  //       navigate('/'); // Use navigate instead of history.push
  //     }, 2000); // 2000 milliseconds (2 seconds) delay before redirecting
  //   } catch (error) {
  //     console.error('Login error:', error.response ? error.response.data : error.message);
  //     // Handle the error, if needed
  //   }
  // };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', { email, password });
      console.log(response.data);
      console.log(email);
      const { token } = response.data;
      login(token);
      setSuccessMessage('Login successful! Redirecting to the home page...');
  
      // Navigate immediately without delay for testing
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      // Handle the error, if needed
    }
  };

  return (
    <div className="form-container">
      <form>
      <img src={Logo} />
        <h1>Login</h1>
        <label>
          Email:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>

      {/* Display the success message */}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default Login;
