import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="main-content">
        <Navbar toggleSidebar={toggleSidebar} />
        {/* Backdrop for mobile */}
        {isSidebarOpen && <div className="mobile-backdrop" onClick={toggleSidebar}></div>}
        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

