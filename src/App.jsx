import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './Login';
import Register from './Register';

import DashboardLayout from './DashboardLayout'; 
import Dashboard from './Dashboard';

import AddPatient from './AddPatient';
import PatientList from './PatientList';

import AddAppointment from './AddAppointment';
import AppointmentList from './AppointmentList';

import MedicationCheck from './MedicationCheck';
import AddMedicine from './AddMedicine';
import MedicineList from './MedicineList';

// ✅ Prescription Page import
import Prescription from "./Prescription";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Sidebar/Navbar Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-patient" element={<AddPatient />} />
          <Route path="patient-list" element={<PatientList />} />
          <Route path="add-appointment" element={<AddAppointment />} />
          <Route path="appointment-list" element={<AppointmentList />} />
          <Route path="medication" element={<MedicationCheck />} />
          <Route path="add-medicine" element={<AddMedicine />} />
          <Route path="medicine-list" element={<MedicineList />} />

          {/* ✅ Prescription route */}
          <Route path="prescription-form" element={<Prescription />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;










