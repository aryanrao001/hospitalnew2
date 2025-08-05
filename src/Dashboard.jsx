import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { FaUserInjured } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [patientCount, setPatientCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const resPatients = await axios.get(`${BACKEND_URL}/api/patients/count`);
        setPatientCount(resPatients.data.count);
      } catch (error) {
        console.error('Failed to fetch patient count:', error);
      }
    };

    fetchCount();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">📊 Dashboard Overview</h2>
      <div className="card-container">
        <Link to="/dashboard/patient-list" className="stat-card card-blue" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="icon-box">
            <FaUserInjured />
          </div>
          <div className="stat-info">
            <h3>{patientCount}</h3>
            <p>Total Patients</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
















