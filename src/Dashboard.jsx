import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { FaUserInjured, FaCalendarCheck } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
  const [patientCount, setPatientCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const resPatients = await axios.get('http://localhost:5000/api/patients/count');
        const resAppointments = await axios.get('http://localhost:5000/api/appointments/count');
        setPatientCount(resPatients.data.count);
        setAppointmentCount(resAppointments.data.count);
      } catch (error) {
        console.error('Failed to fetch counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">📊 Dashboard Overview</h2>
      <div className="card-container">
        <div className="stat-card card-blue">
          <div className="icon-box">
            <FaUserInjured />
          </div>
          <div className="stat-info">
            <h3>{patientCount}</h3>
            <p>Total Patients</p>
          </div>
        </div>

        <div className="stat-card card-green">
          <div className="icon-box">
            <FaCalendarCheck />
          </div>
          <div className="stat-info">
            <h3>{appointmentCount}</h3>
            <p>Total Appointments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;













