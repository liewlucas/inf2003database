import './App.css';
import Navbar from './Components/Navbar';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from "./pages/Home"
import Login from "./pages/Login"
import Posts from "./pages/Posts"
import Footer from "./Components/Footer";


function App() {
  return (
    <div className="App"> 
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" exact Component={HomePage}/> 
          <Route path="/Login" exact Component={Login}/> 
          <Route path="/Posts" exact Component={Posts}/> 
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
