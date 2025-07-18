import React, { useEffect, useState } from 'react';
import './medicineList.css';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';

const MedicineList = () => {
  const [groupedMedicines, setGroupedMedicines] = useState({});
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [editData, setEditData] = useState({
    medicineName: '',
    medicineType: '',
    disease: '',
    days: '1',
    dose: {
      morning: { bf: false, af: false },
      lunch: { bf: false, af: false },
      evening: { bf: false, af: false },
      night: { bf: false, af: false }
    }
  });

  const fetchMedicines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/medicines');
      const grouped = {};
      res.data.forEach(med => {
        if (!grouped[med.disease]) grouped[med.disease] = [];
        grouped[med.disease].push(med);
      });
      setGroupedMedicines(grouped);
    } catch (err) {
      console.error('Error fetching medicines:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/medicines/${id}`);
      fetchMedicines();
    } catch (err) {
      console.error('Error deleting medicine:', err);
    }
  };

  const openEditPopup = (med) => {
    setEditData({ ...med });
    setEditingMedicine(med._id);
  };

  const handleEditChange = (e, time, field) => {
    if (time && field) {
      const updatedDose = {
        ...editData.dose,
        [time]: {
          ...editData.dose[time],
          [field]: e.target.checked
        }
      };
      setEditData(prev => ({ ...prev, dose: updatedDose }));
    } else {
      const { name, value } = e.target;
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/medicines/${editingMedicine}`, editData);
      setEditingMedicine(null);
      fetchMedicines();
    } catch (err) {
      console.error('Error saving medicine:', err);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <div className="medicine-list-container">
      <h2>🧾 Medicine List (Grouped by Disease)</h2>

      {Object.keys(groupedMedicines).length === 0 ? (
        <p className="no-data">No medicines found.</p>
      ) : (
        Object.entries(groupedMedicines).map(([disease, meds]) => (
          <div key={disease} className="disease-group">
            <h3 className="disease-heading">🩺 {disease}</h3>
            <table className="medicine-table">
              <thead>
                <tr>
                  <th>Sl. No</th>
                  <th>Medicine Name</th>
                  <th>Type</th>
                  <th>Days</th>
                  <th>Dose (BF/AF)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {meds.map((med, index) => (
                  <tr key={med._id}>
                    <td>{index + 1}</td>
                    <td>{med.medicineName}</td>
                    <td>{med.medicineType}</td>
                    <td>{med.days}</td>
                    <td>
                      {['morning', 'lunch', 'evening', 'night'].map(time => (
                        <div key={time} className="dose-check-row">
                          <strong>{time.charAt(0).toUpperCase() + time.slice(1)}:</strong>
                          <label>
                            <input type="checkbox" checked={med.dose?.[time]?.bf || false} readOnly /> BF
                          </label>
                          <label>
                            <input type="checkbox" checked={med.dose?.[time]?.af || false} readOnly /> AF
                          </label>
                        </div>
                      ))}
                    </td>
                    <td className="action-btns">
                      <button className="edit-btn" onClick={() => openEditPopup(med)}>
                        <FaEdit />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(med._id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {editingMedicine && (
        <div className="edit-popup">
          <div className="edit-popup-inner">
            <span className="edit-popup-close" onClick={() => setEditingMedicine(null)}>×</span>
            <h3>✏️ Edit Medicine</h3>

            <div className="form-group">
              <label>Medicine Name</label>
              <input type="text" name="medicineName" value={editData.medicineName} onChange={handleEditChange} />
            </div>

            <div className="form-group">
              <label>Medicine Type</label>
              <input type="text" name="medicineType" value={editData.medicineType} onChange={handleEditChange} />
            </div>

            <div className="form-group">
              <label>Disease</label>
              <input type="text" name="disease" value={editData.disease} onChange={handleEditChange} />
            </div>

            <div className="form-group">
              <label>Days</label>
              <input type="number" name="days" min="1" value={editData.days} onChange={handleEditChange} />
            </div>

            <div className="form-group">
              <label>Dose (🍽️ BF / 🍴 AF)</label>
              {['morning', 'lunch', 'evening', 'night'].map(time => (
                <div key={time} className="dose-check-row">
                  <strong>{time.charAt(0).toUpperCase() + time.slice(1)}:</strong>
                  <label>
                    <input
                      type="checkbox"
                      checked={editData.dose[time]?.bf || false}
                      onChange={(e) => handleEditChange(e, time, 'bf')}
                    /> BF
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={editData.dose[time]?.af || false}
                      onChange={(e) => handleEditChange(e, time, 'af')}
                    /> AF
                  </label>
                </div>
              ))}
            </div>

            <div className="popup-buttons">
              <button className="btn-save" onClick={saveEdit}>💾 Save</button>
              <button className="btn-cancel" onClick={() => setEditingMedicine(null)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineList;






