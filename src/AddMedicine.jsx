import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import './AddMedicine.css';

const AddMedicine = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [disease, setDisease] = useState('');
  const [medicines, setMedicines] = useState([
    {
      medicineName: '',
      medicineType: '',
      dose: {
        morning: { bf: false, af: false },
        lunch: { bf: false, af: false },
        evening: { bf: false, af: false },
        night: { bf: false, af: false },
      },
      days: '1',
    },
  ]);

  const handleChange = (index, e) => {
    const { name, value, checked } = e.target;
    const updated = [...medicines];

    if (name.includes('-')) {
      const [time, field] = name.split('-');
      updated[index].dose[time][field] = checked;
    } else {
      updated[index][name] = value;
    }

    setMedicines(updated);
  };

  const handleAdd = () => {
    setMedicines([
      ...medicines,
      {
        medicineName: '',
        medicineType: '',
        dose: {
          morning: { bf: false, af: false },
          lunch: { bf: false, af: false },
          evening: { bf: false, af: false },
          night: { bf: false, af: false },
        },
        days: '1',
      },
    ]);
  };

  const handleDelete = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!disease) return alert('Please enter disease name');

    try {
      const payload = medicines.map((med) => ({ ...med, disease }));
      await axios.post(`${BACKEND_URL}/api/medicines/add`, payload);
      alert('✅ Medicines saved successfully!');
      setDisease('');
      setMedicines([
        {
          medicineName: '',
          medicineType: '',
          dose: {
            morning: { bf: false, af: false },
            lunch: { bf: false, af: false },
            evening: { bf: false, af: false },
            night: { bf: false, af: false },
          },
          days: '1',
        },
      ]);
    } catch (err) {
      console.error('❌ Error:', err.response?.data || err.message);
      alert('Error saving medicines. Check console.');
    }
  };

  return (
    <div className="add-medicine-container">
      <div className="form-box">
        <h2>➕ Add New Medicine</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-flex-container">
            {/* Left Side */}
            <div className="left-form">
              <div className="form-group">
                <label>Disease Name *</label>
                <input
                  type="text"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="Enter Disease Name"
                  required
                />
              </div>
              <div className="sticky-save">
                <button type="submit" className="btn-save">
                  💾 Save Medicines
                </button>
              </div>
            </div>

            {/* Right Side */}
            <div className="right-medicines">
              {medicines.map((medicine, index) => (
                <div className="medicine-group" key={index}>
                  <div className="form-group">
                    <label>Medicine Name *</label>
                    <input
                      type="text"
                      name="medicineName"
                      value={medicine.medicineName}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Medicine Type *</label>
                    <input
                      type="text"
                      name="medicineType"
                      placeholder="Tablet / Syrup / Capsule / Injection"
                      value={medicine.medicineType}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Days *</label>
                    <input
                      type="number"
                      name="days"
                      min="1"
                      value={medicine.days}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </div>
                  <div className="dose-options">
                    {['morning', 'lunch', 'evening', 'night'].map((time) => (
                      <div key={time}>
                        <p><strong>{time}</strong></p>
                        <label>
                          <input
                            type="checkbox"
                            name={`${time}-bf`}
                            checked={medicine.dose[time].bf}
                            onChange={(e) => handleChange(index, e)}
                          /> Before
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            name={`${time}-af`}
                            checked={medicine.dose[time].af}
                            onChange={(e) => handleChange(index, e)}
                          /> After
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="action-buttons">
                    {medicines.length > 1 && (
                      <button type="button" onClick={() => handleDelete(index)} className="btn-delete">
                        <FaTrash /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="add-button-bottom">
                <button type="button" onClick={handleAdd} className="btn-add">
                  <FaPlus /> Add Medicine
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;



