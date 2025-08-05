import React, { useState } from 'react';
import axios from 'axios';
import './medication.css';

const MedicationCheck = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const [phone, setPhone] = useState('');
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/patients`);
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

  const renderDoseShort = (dose) => {
    if (!dose) return '';
    const times = ['morning', 'lunch', 'evening', 'night'];
    return times
      .map((time) => {
        const d = dose[time];
        if (d?.bf || d?.af) {
          return `${time.charAt(0).toUpperCase() + time.slice(1)} (${d.bf ? 'BF' : ''}${d.bf && d.af ? ', ' : ''}${d.af ? 'AF' : ''})`;
        }
        return null;
      })
      .filter(Boolean)
      .join(', ');
  };
const handlePrint = () => {
  if (!patient) return;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(`
    <html>
    <head>
      <title>Print - ${patient.name}</title>
      <style>
        @page {
          size: A4;
          margin: 10mm 12mm;
        }
        html, body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', sans-serif;
          color: #000;
        }
        body {
          margin: 0 auto;
          width: 180mm;
          max-height: 277mm;
          padding: 10px 15px;
          box-sizing: border-box;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 6px;
          margin-bottom: 15px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 3px 0;
          font-size: 14px;
        }
        .section {
          margin-bottom: 15px;
        }
        .section h3 {
          margin-bottom: 8px;
          font-size: 18px;
        }
        .vitals p,
        .info p {
          margin: 3px 0;
          font-size: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 6px;
        }
        th, td {
          border: 1px solid #333;
          padding: 6px;
          text-align: left;
          font-size: 14px;
        }
        th {
          background-color: #eaf4ff;
        }
        hr {
          margin: 20px 0 10px;
        }
        .footer {
          text-align: center;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Shyam Hospital</h1>
        <p>Dr. Santosh Agarwal – Sr. Surgeon</p>
        <p>OPD: 10am – 1pm | 6pm – 8pm | Emergency: 24x7</p>
      </div>

      <div class="section info">
        <h3>👤 Patient Info</h3>
        <p><strong>Name:</strong> ${patient.name}</p>
        <p><strong>Phone:</strong> ${patient.phone}</p>
        <p><strong>Gender:</strong> ${patient.gender}</p>
        <p><strong>Address:</strong> ${patient.address}</p>
      </div>

      <div class="section vitals">
        <h3>🩺 Vitals</h3>
        <p><strong>Weight:</strong> ${patient.weight}</p>
        <p><strong>BP:</strong> ${patient.bp}</p>
        <p><strong>Temperature:</strong> ${patient.temperature}</p>
        <p><strong>SPO2:</strong> ${patient.spo2}</p>
        <p><strong>Blood Sugar:</strong> ${patient.bloodSugar}</p>
      </div>

      <div class="section">
        <h3>💊 Medicines</h3>
        ${
          patient.medicineList?.length > 0
            ? `<table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Days</th>
                    <th>Dose</th>
                  </tr>
                </thead>
                <tbody>
                  ${patient.medicineList.map(med => `
                    <tr>
                      <td>${med.medicineName}</td>
                      <td>${med.medicineType}</td>
                      <td>${med.days}</td>
                      <td>${renderDoseShort(med.dose)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>`
            : '<p>No medicines prescribed.</p>'
        }
      </div>

      <div class="section">
        <h3>🧪 Tests</h3>
        ${
          patient.testList?.length > 0
            ? `<table>
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Required?</th>
                  </tr>
                </thead>
                <tbody>
                  ${patient.testList.map(test => `
                    <tr>
                      <td>${test.testName}</td>
                      <td>${test.required ? '✅ Yes' : '❌ No'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>`
            : '<p>No tests prescribed.</p>'
        }
      </div>

      <hr />
      <div class="footer">
        <p><strong>Shyam Hospital</strong></p>
        <p>Thank you for visiting. Get well soon!</p>
      </div>
    </body>
    </html>
  `);
  newWindow.document.close();
  newWindow.print();
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

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={fetchMedicines}>Search</button>
        {patient && (
          <button onClick={handlePrint} style={{ marginLeft: '10px' }}>
            🖨️ Print
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {patient && (
        <div className="patient-info">
          <h3>👤 Patient Information</h3>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Phone:</strong> {patient.phone}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Address:</strong> {patient.address}</p>
          <p><strong>Weight:</strong> {patient.weight}</p>
          <p><strong>BP:</strong> {patient.bp}</p>
          <p><strong>Temperature:</strong> {patient.temperature}</p>
          <p><strong>SPO2:</strong> {patient.spo2}</p>
          <p><strong>Blood Sugar:</strong> {patient.bloodSugar}</p>

          <h3 style={{ marginTop: '20px' }}>💊 Medicines</h3>
          <table className="medicine-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Medicine Type</th>
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

          <h3 style={{ marginTop: '30px' }}>🧪 Tests</h3>
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









