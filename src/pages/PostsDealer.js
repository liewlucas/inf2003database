import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/PostsDealer.css';

function PostsDealer({ startEditing, deletePost }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postsParam = queryParams.get('posts');
  const posts = postsParam ? JSON.parse(decodeURIComponent(postsParam)) : [];
  

  useEffect(() => {
    // Log the posts data when it changes
    console.log(posts);
  }, [posts]);

  return (
    <div className="container">
      <h1>Posts Dealer Page</h1>
      {/* Display the posts data in a table or other format */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
        
            <th>Quantity</th>
            <th>Price</th>
            <th>Model</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={index}>
              <td>{post.postTitle}</td>
      
              <td>{post.quantity}</td>
              <td>{post.price}</td>
              <td>{post.model}</td>
              <td>
                <button className="edit" onClick={() => startEditing(index)}>Edit</button>
                <button className="delete" onClick={() => deletePost(index)}>Delete</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PostsDealer;
