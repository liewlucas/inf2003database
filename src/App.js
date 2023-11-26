import './App.css';
import Navbar from './Components/Navbar';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Posts from "./pages/Posts"
import Footer from "./Components/Footer";
import AddPost from "./pages/PostsDealerAdd"
import PostsDealer from "./pages/PostsDealer"



function App() {
  return (
    <div className="App"> 
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" exact Component={HomePage}/> 
          <Route path="/Login" exact Component={Login}/> 
          <Route path="/Register" exact Component={Register}/> 
          <Route path="/Posts" exact Component={Posts}/> 
          <Route path="/PostsDealerAdd" exact Component={AddPost}/> 
          <Route path="/PostsDealer" exact Component={PostsDealer} />
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
