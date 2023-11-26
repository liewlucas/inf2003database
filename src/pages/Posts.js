import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItem from '../Components/MenuItem'; // Make sure the path is correct
import '../styles/Menu.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/post');
        const data = response.data;
        console.log("data", data);
        setPosts(data.data ?? []); // Provide a default empty array if data.data is undefined
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClick = (event, postTitle) => {
    event.preventDefault();
    setSuccessMessage(`${postTitle} was clicked!`);

    const selected = posts.find((post) => post.postTitle === postTitle);
    setSelectedPost(selected);
  };

  return (
    <div className="menu">
      <h1 className="menuTitle">Cars Available</h1>
      <div className="menuList">
        {posts?.length > 0 && posts.map((post) => (
          <div key={post.postID} onClick={(event) => handleClick(event, post.postTitle)}>
            <MenuItem
              image="https://media.istockphoto.com/id/1150931120/photo/3d-illustration-of-generic-compact-white-car-front-side-view.jpg?s=612x612&w=0&k=20&c=MkM3U9ruXp2wKCgYKeL6DyZ9H5WFIHtyRWsbOMokrFg="
              name={post.postTitle}
              price={post.price} // Assuming 'price' is a property in your post object
            />
          </div>
        ))}
      </div>

      {selectedPost && (
        <div className="postDetails">
          <h2>{selectedPost.postTitle}</h2>
          <p>Price: {selectedPost.price}</p>
          {/* Add other details as needed */}
        </div>
      )}

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
}

export default Posts;
