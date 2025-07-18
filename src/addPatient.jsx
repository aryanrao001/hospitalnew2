import React, { useState } from 'react';
import axios from 'axios';
import './addPatient.css';

const AddPatient = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    gender: '',
    status: 'active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleReset = () => {
    setForm({
      name: '',
      phone: '',
      address: '',
      gender: '',
      status: 'active',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/patients/add', form);
      console.log("✅ Patient saved:", res.data);
      alert("Patient added successfully");
      handleReset();
    } catch (err) {
      console.error("❌ Error saving patient:", err);
    }
  };

  return (
    <div className="add-patient-container">
      <h3>Add New Patient</h3>
      <form className="patient-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label>Phone No.</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows="3"
            placeholder="Enter address"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">-- Select Gender --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <div className="status-options">
            <label>
              <input
                type="radio"
                name="status"
                value="active"
                checked={form.status === 'active'}
                onChange={handleChange}
              />
              Active
            </label>
            <label>
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={form.status === 'inactive'}
                onChange={handleChange}
              />
              Inactive
            </label>
          </div>
        </div>

        <div className="form-buttons">
          <button type="button" className="btn reset" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" className="btn save">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;

