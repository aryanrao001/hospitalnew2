import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import hospitalLogo from './assets/hospital.png';
import {
  FaTachometerAlt, FaUsers, FaPlus, FaList,
  FaCalendarPlus, FaClipboardList, FaPills,
  FaFileAlt, FaSignOutAlt, FaChevronDown
} from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openPatient, setOpenPatient] = useState(false);
  const [openAppointment, setOpenAppointment] = useState(false);
  const [openMedicine, setOpenMedicine] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleItemClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false); // Close sidebar only on small screens
    }
  };

  const sidebarClass = `sidebar ${isOpen ? 'open' : 'collapsed'}`;

  const renderItem = (icon, label, extra = null) => (
    <>
      <span className="menu-icon">{icon}</span>
      {isOpen && <span className="menu-text">{label}</span>}
      {isOpen && extra}
    </>
  );

  return (
    <nav className={sidebarClass}>
      <div className="logo">
        <img src={hospitalLogo} alt="Logo" />
        {isOpen && (
          <>
            <h1>Hospital</h1>
            <small>ST. Josheph's Hospital</small>
          </>
        )}
      </div>

      <ul className="menu">
        <li>
          <NavLink to="/dashboard" className="item" onClick={handleItemClick}>
            {renderItem(<FaTachometerAlt />, 'Dashboard')}
          </NavLink>
        </li>

        {(role === 'doctor' || role === 'receptionist') && (
          <li>
            <div className="item toggle" onClick={() => setOpenPatient(!openPatient)}>
              {renderItem(<FaUsers />, 'Patient', <FaChevronDown className={`chevron ${openPatient ? 'rotated' : ''}`} />)}
            </div>
            {isOpen && openPatient && (
              <ul className="sub-menu">
                {role === 'receptionist' && (
                  <li>
                    <NavLink to="/dashboard/add-patient" className="item" onClick={handleItemClick}>
                      {renderItem(<FaPlus />, 'Add Patient')}
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/dashboard/patient-list" className="item" onClick={handleItemClick}>
                    {renderItem(<FaList />, 'Patient List')}
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        )}

        {(role === 'doctor' || role === 'receptionist') && (
          <li>
            <div className="item toggle" onClick={() => setOpenAppointment(!openAppointment)}>
              {renderItem(<FaCalendarPlus />, 'Appointment', <FaChevronDown className={`chevron ${openAppointment ? 'rotated' : ''}`} />)}
            </div>
            {isOpen && openAppointment && (
              <ul className="sub-menu">
                {role === 'receptionist' && (
                  <li>
                    <NavLink to="/dashboard/add-appointment" className="item" onClick={handleItemClick}>
                      {renderItem(<FaPlus />, 'Add Appointment')}
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink to="/dashboard/appointment-list" className="item" onClick={handleItemClick}>
                    {renderItem(<FaClipboardList />, 'Appointment List')}
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        )}

        {role === 'receptionist' && (
          <>
            <li>
              <NavLink to="/dashboard/medication" className="item" onClick={handleItemClick}>
                {renderItem(<FaPills />, 'Medication')}
              </NavLink>
            </li>
            <li>
              <div className="item toggle" onClick={() => setOpenMedicine(!openMedicine)}>
                {renderItem(<FaFileAlt />, 'Medicine', <FaChevronDown className={`chevron ${openMedicine ? 'rotated' : ''}`} />)}
              </div>
              {isOpen && openMedicine && (
                <ul className="sub-menu">
                  <li>
                    <NavLink to="/dashboard/add-medicine" className="item" onClick={handleItemClick}>
                      {renderItem(<FaPlus />, 'Add Medicine')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard/medicine-list" className="item" onClick={handleItemClick}>
                      {renderItem(<FaList />, 'Medicine List')}
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
          </>
        )}

        {/* ✅ Added below: Prescription Form for Doctor */}
        {role === 'doctor' && (
          <li>
            <NavLink to="/dashboard/prescription-form" className="item" onClick={handleItemClick}>
              {renderItem(<FaFileAlt />, 'Prescription Form')}
            </NavLink>
          </li>
        )}

        <li className="bottom">
          <button className="logout" onClick={() => {
            handleLogout();
            handleItemClick(); // Also close sidebar on logout in mobile
          }}>
            <FaSignOutAlt className="menu-icon" />
            {isOpen && 'Logout'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;





