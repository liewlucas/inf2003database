import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/PostsDealer.css';

function PostsDealer({ deletePost }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const postsParam = queryParams.get('posts');
  const posts = postsParam ? JSON.parse(decodeURIComponent(postsParam)) : [];
  const dealerID = 2299;
  const [editIndex, setEditIndex] = useState(-1);
  const [editedPost, setEditedPost] = useState(null);
  const [editedPostData, setEditedPostData] = useState({
    postTitle: '',
    cmID: '',
    price: '',
    quantity: '',
    dealerID: '',
  });
  
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0];

  useEffect(() => {
    if (dealerID) {
      fetch(`http://localhost:3001/api/post/${dealerID}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setFetchedPosts(data.data);
            console.log(data.data);
          } else {
            console.error('Error:', data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, [dealerID]);

  const startEditing = (index) => {
    setEditIndex(index);
    const postToEdit = fetchedPosts[index];
    setEditedPost({ ...postToEdit });
    setEditedPostData({
      postTitle: postToEdit.postTitle,
      cmID: postToEdit.cmID,
      price: postToEdit.price,
      quantity: postToEdit.quantity,
      dealerID: postToEdit.dealerID,
    });
  };

  const cancelEditing = () => {
    setEditIndex(-1);
    setEditedPost(null);
    setEditedPostData({
      postTitle: '',
      cmID: '',
      price: '',
      quantity: '',
      dealerID: '',
    });
  };

  const updatePost = (index) => {
    console.log('State before updatePost:', editedPostData, fetchedPosts[index]);
    const postToEdit = fetchedPosts[index];
  
    // Ensure that postTitle is not null or undefined
    if (editedPostData.postTitle === null || editedPostData.postTitle === undefined) {
      // Set a default value or handle it appropriately
      editedPostData.postTitle = "Default Title";
    }
  
    // Include postID in the editedPostData
    const updatedPostData = {
      ...editedPostData,
      postID: postToEdit.postID,
    };
  
    const updatedPost = { ...fetchedPosts[index], ...updatedPostData };
  
    // Log the data for debugging
    console.log('editedPostData:', updatedPostData);
    console.log('updatedPost:', updatedPost);
  
    fetch(`http://localhost:3001/api/posts/${updatedPost.postID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPostData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const updatedPosts = [...fetchedPosts];
          updatedPosts[index] = updatedPost;
          setFetchedPosts(updatedPosts);
          cancelEditing();
          console.log('Post updated successfully:', data.message);
        } else {
          console.error('Error updating post:', data.message);
        }
      })
      .catch(error => {
        console.error('Error updating post:', error);
      });
  };
  

  const handleDelete = (postId) => {
    fetch(`http://localhost:3001/api/posts/${postId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Delete the post from the local state
          const updatedPosts = [...fetchedPosts];
          updatedPosts.splice(editIndex, 1);
          setFetchedPosts(updatedPosts);

          // Cancel editing
          cancelEditing();

          console.log('Post deleted successfully:', data.message);
        } else {
          console.error('Error deleting post:', data.message);
        }
      })
      .catch(error => {
        console.error('Error deleting post:', error);
      });
  };

  return (
    <div className="container">
      <h1>Posts Dealer Page</h1>
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
          {fetchedPosts.length === 0 ? (
            <tr>
              <td colSpan="5">No posts available</td>
            </tr>
          ) : (
            fetchedPosts.map((data, index) => {
              console.log(data);
              return (
                <tr key={index}>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editedPostData.postTitle}
                        onChange={(e) => setEditedPostData({ ...editedPostData, postTitle: e.target.value })}
                      />
                    ) : (
                      data.postTitle
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editedPostData.quantity}
                        onChange={(e) => setEditedPostData({ ...editedPostData, quantity: e.target.value })}
                      />
                    ) : (
                      data.quantity
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="text"
                        value={editedPostData.price}
                        onChange={(e) => setEditedPostData({ ...editedPostData, price: e.target.value })}
                      />
                    ) : (
                      data.price
                    )}
                  </td>
                  <td>{data.modelName}</td>
                  <td>
                    {editIndex === index ? (
                      <>
                        <button className="save" onClick={() => updatePost(index)}>Save</button>


                        <button className="cancel" onClick={cancelEditing}>Cancel</button>
                      </>
                    ) : (
                      <button className="edit" onClick={() => startEditing(index)}>Edit</button>
                    )}
                    <button className="delete" onClick={() => handleDelete(data.postID)}>Delete</button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PostsDealer;
