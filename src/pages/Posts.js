import React from 'react'
import { Link } from "react-router-dom";
import "../styles/Posts.css";
import { MenuList } from '../helpers/MenuList'
//import { MenuItem } from '@mui/material';
import MenuItem from '../Components/MenuItem';
import '../styles/Menu.css'

function Posts() {
  return (
    <div className="menu">
       <h1 className="menuTitle">Cars Available</h1>
        <div className="menuList">
        {MenuList.map((menuItem, key) => {
          return (
            <MenuItem
              key={key}
              image={menuItem.image}
              name={menuItem.name}
              price={menuItem.price} 
            />
          );})}
       </div>
      </div>
  )
}

export default Posts
