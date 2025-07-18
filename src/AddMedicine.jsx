import React, { useState } from 'react';
import './addMedicine.css';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';

// ...imports
const AddMedicine = () => {
  const [disease, setDisease] = useState('');
  const [medicines, setMedicines] = useState([
    {
      medicineName: '',
      medicineType: '',
      dose: {
        morning: { bf: false, af: false },
        lunch: { bf: false, af: false },
        evening: { bf: false, af: false },
        night: { bf: false, af: false }
      },
      days: '1'
    }
  ]);

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
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
          night: { bf: false, af: false }
        },
        days: '1'
      }
    ]);
  };

  const handleDelete = (index) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!disease) {
      alert("Please enter disease name");
      return;
    }

    try {
      const payload = medicines.map((med) => ({
        ...med,
        disease
      }));

      await axios.post('http://localhost:5000/api/medicines/add', payload);
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
            night: { bf: false, af: false }
          },
          days: '1'
        }
      ]);
    } catch (err) {
      console.error('❌ Error saving medicines:', err.response?.data || err.message);
      alert('Error saving medicines. Check console.');
    }
  };

  return (
    <div className="add-medicine-container">
      <div className="form-box">
        <h2>➕ Add New Medicine</h2>
        <form className="medicine-form" onSubmit={handleSubmit}>
          <div className="form-flex-container">
            <div className="left-form">
              <div className="form-group">
                <label>Disease Name *</label>
                <input
                  type="text"
                  name="disease"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="Enter Disease Name"
                  required
                />
              </div>
              <div className="sticky-save">
                <button type="submit" className="btn-save">💾 Save Medicines</button>
              </div>
            </div>

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
                      value={medicine.medicineType}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="Tablet / Syrup / Capsule / Injection"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Dose *</label>
                    {["morning", "lunch", "evening", "night"].map((time) => (
                      <div key={time} style={{ marginBottom: '8px' }}>
                        <strong>{time.charAt(0).toUpperCase() + time.slice(1)}:</strong>
                        <label style={{ marginLeft: '10px' }}>
                          <input
                            type="checkbox"
                            name={`${time}-bf`}
                            checked={medicine.dose[time].bf}
                            onChange={(e) => handleChange(index, e)}
                          /> Before Food
                        </label>
                        <label style={{ marginLeft: '10px' }}>
                          <input
                            type="checkbox"
                            name={`${time}-af`}
                            checked={medicine.dose[time].af}
                            onChange={(e) => handleChange(index, e)}
                          /> After Food
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label>Days *</label>
                    <input
                      type="number"
                      name="days"
                      value={medicine.days}
                      onChange={(e) => handleChange(index, e)}
                      min="1"
                      required
                    />
                  </div>

                  <div className="action-buttons">
                    <button type="button" className="btn-add" onClick={handleAdd}>
                      <FaPlus /> Add
                    </button>
                    {medicines.length > 1 && (
                      <button type="button" className="btn-delete" onClick={() => handleDelete(index)}>
                        <FaTrash /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
