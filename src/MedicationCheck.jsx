import React, { useState } from 'react';
import axios from 'axios';
import './medication.css';

const MedicationCheck = () => {
  const [phone, setPhone] = useState('');
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/patients`);
      const match = res.data.find((p) => p.phone === phone.trim());

      if (match) {
        setPatient(match);
        setError('');
      } else {
        setPatient(null);
        setError('❌ Patient not found with this phone number.');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Something went wrong.');
    }
  };

  const renderDose = (dose) => {
    if (!dose) return '—';
    const times = ['morning', 'lunch', 'evening', 'night'];

    return times.map((time) => {
      const d = dose[time];
      if (d?.bf || d?.af) {
        return (
          <div key={time}>
            <strong>{time.charAt(0).toUpperCase() + time.slice(1)}:</strong>{" "}
            {d.bf && '🕗 BF '} {d.af && '🍽️ AF'}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="medication-check-container">
      <h2>🩺 Check Your Prescribed Medicines & Tests</h2>

      {/* 🔍 Search Input */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={fetchMedicines}>Search</button>
      </div>

      {/* ❌ Error Message */}
      {error && <p className="error">{error}</p>}

      {/* 👤 Patient Details */}
      {patient && (
        <div className="patient-info">
          <h3>👤 Patient Information</h3>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Phone:</strong> {patient.phone}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Address:</strong> {patient.address}</p>

          {/* 💊 Medicine List */}
          <h3 style={{ marginTop: '20px' }}>💊 Prescribed Medicines</h3>
          <table className="medicine-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Days</th>
                <th>Dose (BF / AF)</th>
              </tr>
            </thead>
            <tbody>
              {patient.medicineList?.length > 0 ? (
                patient.medicineList.map((med, idx) => (
                  <tr key={idx}>
                    <td>{med.medicineName}</td>
                    <td>{med.medicineType}</td>
                    <td>{med.days}</td>
                    <td>{renderDose(med.dose)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No medicines prescribed.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 🧪 Test List */}
          <h3 style={{ marginTop: '30px' }}>🧪 Prescribed Tests</h3>
          <table className="medicine-table">
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Required?</th>
              </tr>
            </thead>
            <tbody>
              {patient.testList?.length > 0 ? (
                patient.testList.map((test, idx) => (
                  <tr key={idx}>
                    <td>{test.testName}</td>
                    <td>{test.required ? '✅ Yes' : '❌ No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No tests prescribed.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MedicationCheck;







