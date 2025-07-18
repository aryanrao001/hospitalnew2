import React, { useState } from 'react';
import './AddAppointment.css';

const AddAppointment = () => {
  const [form, setForm] = useState({
    patient: '',         // ✅ Changed from patientName
    doctor: '',
    department: '',
    date: '',
    problem: '',
    status: 'active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleReset = () => {
    setForm({
      patient: '',
      doctor: '',
      department: '',
      date: '',
      problem: '',
      status: 'active'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/appointments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('✅ Appointment saved!');
        handleReset(); // Clear the form
      } else {
        const data = await res.json();
        alert(data?.error || '❌ Failed to save appointment');
      }
    } catch (err) {
      console.error('❌ Error submitting form:', err);
      alert('Server error occurred');
    }
  };

  return (
    <div className="appointment-container">
      <h3>Add Appointment</h3>
    <form onSubmit={handleSubmit} className="add-appointment-form">

        <input
          type="text"
          name="patient"                // ✅ updated
          value={form.patient}
          onChange={handleChange}
          placeholder="Patient Name"
          required
        />
        <input
          type="text"
          name="doctor"
          value={form.doctor}
          onChange={handleChange}
          placeholder="Doctor Name"
          required
        />
        <select name="department" value={form.department} onChange={handleChange} required>
          <option value="">Select Department</option>
          <option>Radiology</option>
          <option>Cardiology</option>
          <option>Emergency</option>
          <option>Neurology</option>
          <option>Orthopedics</option>
          <option>ENT</option>
          <option>Dermatology</option>
        </select>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <textarea
          name="problem"
          value={form.problem}
          onChange={handleChange}
          placeholder="Problem"
        />
        <div>
          <label>
            <input
              type="radio"
              name="status"
              value="active"
              checked={form.status === 'active'}
              onChange={handleChange}
            /> Active
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="inactive"
              checked={form.status === 'inactive'}
              onChange={handleChange}
            /> Inactive
          </label>
        </div>
        <div className="form-buttons">
          <button type="submit">Save</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default AddAppointment;

