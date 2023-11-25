import React, { useState } from 'react';
import '../styles/PostsDealer.css';
import { useNavigate } from 'react-router-dom';

function AddPost() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [carModel, setCarModel] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [model, setModel] = useState('');
  const [editIndex, setEditIndex] = useState(-1);

  const addNewPost = () => {
    if (
      postTitle.trim() !== '' &&
      carModel.trim() !== '' &&
      quantity !== '' &&
      !isNaN(quantity) && // Check if quantity is numeric
      parseFloat(quantity) >= 0 && // Check if quantity is non-negative
      price !== '' &&
      !isNaN(price) && // Check if price is numeric
      parseFloat(price) >= 0 && // Check if price is non-negative
      model !== ''
    ) {
      const newPost = {
        title: postTitle,
        carModel,
        quantity,
        price,
        model
      };
      const updatedPosts = [...posts, newPost];
      setPosts(updatedPosts);
      setPostTitle('');
      setCarModel('');
      setQuantity('');
      setPrice('');
      setModel('');
      navigate(`/PostsDealer?posts=${encodeURIComponent(JSON.stringify(updatedPosts))}`);
    } else {
      alert('All fields are mandatory. Quantity must be a non-negative numeric value and Price must be a non-negative float value.');
    }
  };

  const deletePost = (index) => {
    const updatedPosts = [...posts];
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
    if (editIndex === index) {
      setEditIndex(-1);
    }
  };

  const startEditing = (index) => {
    setEditIndex(index);
    const post = posts[index];
    setPostTitle(post.title);
    setCarModel(post.carModel);
    setQuantity(post.quantity);
    setPrice(post.price);
    setModel(post.model);
  };

  const cancelEditing = () => {
    setEditIndex(-1);
    setPostTitle('');
    setCarModel('');
    setQuantity('');
    setPrice('');
    setModel('');
  };

  const updatePost = () => {
    const updatedPosts = [...posts];
    updatedPosts[editIndex] = {
      title: postTitle,
      carModel,
      quantity,
      price,
      model
    };
    setPosts(updatedPosts);
    setEditIndex(-1);
    setPostTitle('');
    setCarModel('');
    setQuantity('');
    setPrice('');
    setModel('');
  };

  return (
    <div className="container">
      <div className="form">
        <h1>{editIndex !== -1 ? 'Update Post' : 'Add New Post'}</h1>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          placeholder="Enter Post Title"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />
        <label htmlFor="carModel">Car Model:</label>
        <input
          type="text"
          id="carModel"
          placeholder="Enter Car Model"
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
        />
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          placeholder="Enter Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          placeholder="Enter Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <label htmlFor="model">Model:</label>
        <select id="model" value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="">Select Model</option>
          <option value="Model A">Model A</option>
          <option value="Model B">Model B</option>
          <option value="Model C">Model C</option>
        </select>
        
        {editIndex !== -1 ? (
        <>
            <button className="save" onClick={updatePost}>Save</button>
            <button className="cancel" onClick={cancelEditing}>Cancel</button>
        </>
        ) : (
        <button onClick={addNewPost}>Add Post</button>
        )}
      </div>

        {/* Render the PostTable component */}
        {/* <PostsDealer posts={posts} /> */}
      {/* <PostsDealer posts={posts} startEditing={startEditing} deletePost={deletePost} /> */}

      {/* <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Car Model</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Model</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={index}>
              <td>{post.title}</td>
              <td>{post.carModel}</td>
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
      </table> */}


    </div>
  );
}

export default AddPost;
