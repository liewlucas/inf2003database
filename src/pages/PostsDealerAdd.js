import React, { useState, useEffect } from 'react';
import '../styles/PostsDealer.css';
import { useNavigate } from 'react-router-dom';


function AddPost() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [model, setModel] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [carModels, setCarModels] = useState([]);
  const [modelNames, setModelNames] = useState([]);
  useEffect(() => {
    const fetchCarModels = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/carmodels');
        if (response.ok) {
          const responseData = await response.json();

          // Check if carModels is an array before using map
          if (Array.isArray(responseData.carModels)) {
            const cmIDs = responseData.carModels.map((carModel) => carModel.cmID);
            const names = responseData.carModels.map((carModel) => carModel.modelName);

            console.log('CMIDs:', cmIDs);
            console.log('Model Names:', names);

            setCarModels(cmIDs);
            setModelNames(names); // Add this line to set model names in the state
          } else {
            console.error('Car models is not an array:', responseData.carModels);
          }
        } else {
          console.error('Failed to fetch car models');
        }
      } catch (error) {
        console.error('Error fetching car models:', error);
      }
    };

    fetchCarModels();
  }, []);
  
  
  
  
  
  const addNewPost = async () => {
    if (
      postTitle.trim() !== '' &&
      quantity !== '' &&
      !isNaN(quantity) && // Check if quantity is numeric
      parseFloat(quantity) >= 0 && // Check if quantity is non-negative
      price !== '' &&
      !isNaN(price) && // Check if price is numeric
      parseFloat(price) >= 0 && // Check if price is non-negative
      model !== ''
    ) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const newPost = {
        postTitle: postTitle,
        cmID: model, // Use the selected model from the dropdown
        postDate: formattedDate,
        price: parseFloat(price),
        quantity: parseFloat(quantity),
      };
      
  
      try {
        const response = await fetch('http://localhost:3001/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log('Post created successfully:', result);
          // Handle success, e.g., update state, navigate, etc.
          const updatedPosts = [...posts, newPost];
          setPosts(updatedPosts);
          setPostTitle('');
          setQuantity('');
          setPrice('');
          setModel('');
          navigate(`/PostsDealer?posts=${encodeURIComponent(JSON.stringify(updatedPosts))}`);
        } else {
          // Handle error
          const errorMessage = await response.text();
          alert(`Error adding post: ${errorMessage}`);
        }
      } catch (error) {
        // Handle network error
        console.error('Error adding post:', error);
        alert('Network error occurred. Please try again.');
      }
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
    setQuantity(post.quantity);
    setPrice(post.price);
    setModel(post.model);
  };

  const cancelEditing = () => {
    setEditIndex(-1);
    setPostTitle('');
    setQuantity('');
    setPrice('');
    setModel('');
  };

  const updatePost = () => {
    const updatedPosts = [...posts];
    updatedPosts[editIndex] = {
      title: postTitle,
      quantity,
      price,
      model
    };
    setPosts(updatedPosts);
    setEditIndex(-1);
    setPostTitle('');
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
        <select id="model" value={model} onChange={(e) => setModel(parseInt(e.target.value, 10))}>
          <option value="">Select Model</option>
          {carModels.map((cmID, index) => (
            <option key={index} value={cmID}>
              {modelNames[index]}
            </option>
          ))}
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

   


    </div>
  );
}

export default AddPost;
