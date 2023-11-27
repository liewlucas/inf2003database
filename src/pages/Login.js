import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import Logo from "../assets/loginlogo.png";
import { useAuth } from '../helpers/AuthContext';
// using auth token to authenticate

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true); // Set loading to true while waiting for the response

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
    } finally {
      setLoading(false); // Set loading to false after the response is received
    }
  };

  return (
    <div className="form-container">
      <form>
        <img src={Logo} alt="Logo" />
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
        {/* Disable the button when loading is true */}
        <button type="button" onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Display the success message */}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default Login;
