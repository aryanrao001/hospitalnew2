import React, { useEffect, useState } from 'react';
import './AppointmentList.css';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    department: '',
    date: '',
    problem: '',
    status: 'active'
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch('http://localhost:5000/api/appointments');
    const data = await res.json();
    setAppointments(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this appointment?')) {
      try {
        await fetch(`http://localhost:5000/api/appointments/${id}`, {
          method: 'DELETE',
        });
        fetchAppointments();
      } catch (err) {
        console.error('❌ Delete failed:', err);
      }
    }
  };

  const handleEditClick = (app) => {
    setEditId(app._id);
    setFormData({
      patient: app.patient,
      doctor: app.doctor,
      department: app.department,
      date: app.date,
      problem: app.problem,
      status: app.status
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await fetch(`http://localhost:5000/api/appointments/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setEditId(null);
      fetchAppointments();
    } catch (err) {
      console.error('❌ Update failed:', err);
    }
  };

  return (
    <div className="appointment-list-container">
      <h3>📋 Appointment List</h3>

      {/* Table wrapper for horizontal scroll */}
      <div className="table-wrapper">
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Date</th>
              <th>Problem</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, i) => (
              <tr key={a._id}>
                <td>{i + 1}</td>
                <td>{a.patient}</td>
                <td>{a.doctor}</td>
                <td>{a.department}</td>
                <td>{a.date}</td>
                <td>{a.problem}</td>
                <td>{a.status}</td>
                <td className='buttonedit' >
                  <button className="edit-btn" onClick={() => handleEditClick(a)}>✏️</button>
                  <button className="delete-btn" onClick={() => handleDelete(a._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Popup */}
      {editId && (
        <div className="edit-popup-overlay">
          <div className="edit-popup">
            <h4>🛠️ Edit Appointment</h4>
            <input name="patient" value={formData.patient} onChange={handleInputChange} placeholder="Patient Name" />
            <input name="doctor" value={formData.doctor} onChange={handleInputChange} placeholder="Doctor Name" />
            <input name="department" value={formData.department} onChange={handleInputChange} placeholder="Department" />
            <input name="date" type="date" value={formData.date} onChange={handleInputChange} />
            <input name="problem" value={formData.problem} onChange={handleInputChange} placeholder="Problem" />
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="popup-buttons">
              <button className="update-btn" onClick={handleUpdate}>✅ Update</button>
              <button className="cancel-btn" onClick={() => setEditId(null)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;



