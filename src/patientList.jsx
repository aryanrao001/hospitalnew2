import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './patientList.css';
import { useNavigate } from 'react-router-dom';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [editPatient, setEditPatient] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',

    phone: '',   
    gender: '',
    status: '',
    address: ''
  });       

  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients');
      setPatients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this patient?')) {
      try {
        await axios.delete(`http://localhost:5000/api/patients/${id}`);
        fetchPatients();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleEditClick = (patient) => {
    setEditPatient(patient._id);
    setEditFormData({
      name: patient.name,
      phone: patient.phone,
      gender: patient.gender,
      status: patient.status,
      address: patient.address,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePatientUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/patients/${editPatient}`, editFormData);
      setEditPatient(null);
      fetchPatients();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="patient-list-container">
      <h3>📝 Patient List</h3>
      <table className="patient-table">
        <thead>
          <tr>
            <th>Sl. No</th>
            <th>Patient Name</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p, index) => (
            <tr key={p._id}>
              <td>{index + 1}</td>
              <td>{p.name}</td>
              <td>{p.phone}</td>
              <td>{p.gender}</td>
              <td>{p.status}</td>
              <td>{p.address}</td>
              <td className='btnmode'>
                {role === 'doctor' && (
                  <button
                    className="btn-create-icon"
                    onClick={() =>
                      navigate('/dashboard/prescription-form', {
                        state: {
                          patients: patients,
                          popupPatientId: p._id
                        }
                      })
                    }
                  >➕</button>
                )}
                <button className="btn-edit" onClick={() => handleEditClick(p)}>✏️</button>
                <button className="btn-delete" onClick={() => handleDelete(p._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editPatient && (
        <div className="popup">
          <div className="popup-inner">
            <h3>✏️ Edit Patient</h3>
            <input name="name" value={editFormData.name} onChange={handleEditFormChange} placeholder="Name" />
            <input name="phone" value={editFormData.phone} onChange={handleEditFormChange} placeholder="Phone" />
            <input name="gender" value={editFormData.gender} onChange={handleEditFormChange} placeholder="Gender" />
            <input name="status" value={editFormData.status} onChange={handleEditFormChange} placeholder="Status" />
            <input name="address" value={editFormData.address} onChange={handleEditFormChange} placeholder="Address" />
            <div className="popup-buttons">
              <button onClick={handlePatientUpdate} className="btn-save">✅ Update</button>
              <button onClick={() => setEditPatient(null)} className="btn-cancel">❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;





























