// App.js
import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Posts from "./pages/Posts"
import Footer from "./Components/Footer";
import AddPost from "./pages/PostsDealerAdd"
import PostsDealer from "./pages/PostsDealer"
import { AuthProvider } from './helpers/AuthContext'; // Import the AuthProvider

function App() {
  return (
    <div className="App">
      <AuthProvider> {/* Wrap your entire application with the AuthProvider */}
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Posts" element={<Posts />} />
            <Route path="/PostsDealerAdd" element={<AddPost />} />
            <Route path="/PostsDealer" element={<PostsDealer />} />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
