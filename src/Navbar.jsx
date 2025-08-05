import React from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => (
  <header className="navbar">
    <button className="menu-btn" onClick={toggleSidebar}>
      <FaBars />
    </button>

    <div className="navbar-title">Dashboard</div>

  
   
  </header>
);

export default Navbar;



