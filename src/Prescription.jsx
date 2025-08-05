import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Prescription.css";

const defaultTestList = [
  "Blood Sugar", "Blood Pressure", "CBC", "LFT", "KFT",
  "ECG", "X-Ray", "Urine Test", "Lipid Profile", "Thyroid Panel"
];

const initializeDose = () => ({
  morning: { bf: false, af: false },
  lunch: { bf: false, af: false },
  evening: { bf: false, af: false },
  night: { bf: false, af: false },
});

const Prescription = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const { patients, popupPatientId } = location.state || {};
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState("");
  const [medicineList, setMedicineList] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [testList, setTestList] = useState(
    defaultTestList.map(name => ({ testName: name, required: false }))
  );
  const [printData, setPrintData] = useState(null);

  const selectedPatient = patients?.find(p => p._id === popupPatientId);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/medicines`)
      .then(res => {
        const allDiseases = [...new Set(res.data.map(m => m.disease.toLowerCase()))];
        setDiseases(allDiseases);
      }).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedDisease) {
      axios.get(`${BACKEND_URL}/api/medicines?disease=${selectedDisease}`)
        .then(res => {
          const meds = Array.isArray(res.data) ? res.data : [res.data];
          setMedicineList(meds.map(med => ({
            ...med,
            editing: false,
            dose: med.dose || initializeDose()
          })));
        }).catch(console.error);
    }
  }, [selectedDisease]);

  const toggleMedicineSelection = id => {
    setSelectedMedicines(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const toggleEditMode = index => {
    const updated = [...medicineList];
    updated[index].editing = !updated[index].editing;
    setMedicineList(updated);
  };

  const handleMedicineFieldChange = (index, field, value) => {
    const updated = [...medicineList];
    updated[index][field] = value;
    setMedicineList(updated);
  };

  const handleDoseChange = (index, timeOfDay, type, value) => {
    const updated = [...medicineList];
    updated[index].dose[timeOfDay][type] = value;
    setMedicineList(updated);
  };

  const handleTestCheckboxChange = (idx, checked) => {
    const updated = [...testList];
    updated[idx].required = checked;
    setTestList(updated);
  };

  const renderDoseShort = (dose) => {
    if (!dose) return '';
    const times = ['morning', 'lunch', 'evening', 'night'];
    return times.map((time) => {
      const d = dose[time];
      if (d?.bf || d?.af) {
        return `${time.charAt(0).toUpperCase() + time.slice(1)} (${d.bf ? 'BF' : ''}${d.bf && d.af ? ', ' : ''}${d.af ? 'AF' : ''})`;
      }
      return null;
    }).filter(Boolean).join(', ');
  };

  const handleSave = async () => {
    const selectedMeds = medicineList.filter(med => selectedMedicines.includes(med._id));
    const formattedMeds = selectedMeds.map(m => ({
      medicineName: m.medicineName || "",
      medicineType: m.medicineType || "",
      days: Number(m.days) || 1,
      dose: m.dose || initializeDose()
    }));
    const formattedTests = testList.filter(t => t.required).map(t => ({
      testName: t.testName,
      required: true
    }));

    try {
      await axios.put(`${BACKEND_URL}/api/patients/${selectedPatient._id}`, {
        medicineList: formattedMeds,
        testList: formattedTests
      });

      setPrintData({ ...selectedPatient, medicineList: formattedMeds, testList: formattedTests });
      alert("✅ Prescription saved successfully.");
    } catch (err) {
      console.error("❌ Save Error:", err.response?.data || err.message);
      alert("❌ Failed to save prescription.");
    }
  };

  const handlePrint = () => {
    if (!printData) return;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
      <head>
        <title>Print - ${printData.name}</title>
        <style>
          @page { size: A4; margin: 10mm 12mm; }
          body { font-family: 'Segoe UI', sans-serif; color: #000; width: 180mm; margin: auto; }
          .header { text-align: center; border-bottom: 2px solid #000; margin-bottom: 15px; }
          .header h1 { margin: 0; font-size: 24px; }
          .section { margin-bottom: 20px; }
          h3 { margin: 8px 0; font-size: 18px; }
          p { margin: 3px 0; font-size: 15px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #333; padding: 6px; font-size: 14px; }
          th { background: #eaf4ff; }
          .footer { text-align: center; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Shyam Hospital</h1>
          <p>Dr. Santosh Agarwal – Sr. Surgeon</p>
          <p>OPD: 10am–1pm | 6pm–8pm | Emergency: 24x7</p>
        </div>

        <div class="section">
          <h3>👤 Patient Info</h3>
          <p><strong>Name:</strong> ${printData.name}</p>
          <p><strong>Phone:</strong> ${printData.phone}</p>
          <p><strong>Gender:</strong> ${printData.gender}</p>
          <p><strong>Address:</strong> ${printData.address}</p>
        </div>

        <div class="section">
          <h3>🩺 Vitals</h3>
          <p><strong>Weight:</strong> ${printData.weight}</p>
          <p><strong>BP:</strong> ${printData.bp}</p>
          <p><strong>Temperature:</strong> ${printData.temperature}</p>
          <p><strong>SPO2:</strong> ${printData.spo2}</p>
          <p><strong>Blood Sugar:</strong> ${printData.bloodSugar}</p>
        </div>

        <div class="section">
          <h3>💊 Medicines</h3>
          ${
            printData.medicineList?.length > 0 ? `
              <table>
                <thead>
                  <tr>
                    <th>Name</th><th>Type</th><th>Days</th><th>Dose</th>
                  </tr>
                </thead>
                <tbody>
                  ${printData.medicineList.map(m => `
                    <tr>
                      <td>${m.medicineName}</td>
                      <td>${m.medicineType}</td>
                      <td>${m.days}</td>
                      <td>${renderDoseShort(m.dose)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : `<p>No medicines prescribed.</p>`
          }
        </div>

        <div class="section">
          <h3>🧪 Tests</h3>
          ${
            printData.testList?.length > 0 ? `
              <table>
                <thead>
                  <tr><th>Test</th><th>Required?</th></tr>
                </thead>
                <tbody>
                  ${printData.testList.map(t => `
                    <tr><td>${t.testName}</td><td>${t.required ? '✅ Yes' : '❌ No'}</td></tr>
                  `).join('')}
                </tbody>
              </table>
            ` : `<p>No tests prescribed.</p>`
          }
        </div>

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

  if (!selectedPatient) return <p>No patient selected.</p>;

  return (
    <div className="prescription-container">
      <h2 className="form-header">🩺 Prescription Form</h2>

      <div className="patient-info">
        <p><strong>Name:</strong> {selectedPatient.name}</p>
        <p><strong>Phone:</strong> {selectedPatient.phone}</p>
        <p><strong>Gender:</strong> {selectedPatient.gender}</p>
        <p><strong>Address:</strong> {selectedPatient.address}</p>
        <p><strong>Weight:</strong> {selectedPatient.weight}</p>
        <p><strong>BP:</strong> {selectedPatient.bp}</p>
        <p><strong>Temperature:</strong> {selectedPatient.temperature}</p>
        <p><strong>SPO2:</strong> {selectedPatient.spo2}</p>
        <p><strong>Blood Sugar:</strong> {selectedPatient.bloodSugar}</p>
      </div>

      <label><strong>Select Disease:</strong></label>
      <select value={selectedDisease} onChange={(e) => setSelectedDisease(e.target.value)}>
        <option value="">-- Select Disease --</option>
        {diseases.map((dis, idx) => <option key={idx} value={dis}>{dis}</option>)}
      </select>

      {medicineList.length > 0 && (
  <>
    <h4>💊 Suggested Medicines</h4>
    <table className="medicine-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Days</th>
          <th>Dose (M/A/E/N)</th>
          <th>Edit</th>
          <th>Select</th>
        </tr>
      </thead>
      <tbody>
        {medicineList.map((med, idx) => (
          <tr key={idx}>
            <td>
              {med.editing ? (
                <input
                  value={med.medicineName}
                  onChange={(e) => handleMedicineFieldChange(idx, 'medicineName', e.target.value)}
                />
              ) : (
                med.medicineName
              )}
            </td>
            <td>
              {med.editing ? (
                <input
                  value={med.medicineType}
                  onChange={(e) => handleMedicineFieldChange(idx, 'medicineType', e.target.value)}
                />
              ) : (
                med.medicineType
              )}
            </td>
            <td>
              <input
                type="number"
                min="1"
                value={med.days}
                onChange={(e) => handleMedicineFieldChange(idx, 'days', e.target.value)}
              />
            </td>
            <td>
              {['morning', 'afternoon', 'evening', 'night'].map((time) => (
                <div key={time} style={{ marginBottom: '5px' }}>
                  <strong>{time.charAt(0).toUpperCase() + time.slice(1)}:</strong>
                  <label style={{ marginLeft: '5px' }}>
                    <input
                      type="checkbox"
                      checked={med.dose[time]?.bf || false}
                      onChange={(e) => handleDoseChange(idx, time, 'bf', e.target.checked)}
                    />
                    BF
                  </label>
                  <label style={{ marginLeft: '5px' }}>
                    <input
                      type="checkbox"
                      checked={med.dose[time]?.af || false}
                      onChange={(e) => handleDoseChange(idx, time, 'af', e.target.checked)}
                    />
                    AF
                  </label>
                </div>
              ))}
            </td>
            <td>
              <button onClick={() => toggleEditMode(idx)}>
                {med.editing ? "💾" : "✏️"}
              </button>
            </td>
            <td>
              <input
                type="checkbox"
                checked={selectedMedicines.includes(med._id)}
                onChange={() => toggleMedicineSelection(med._id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}


      <h4>🧪 Tests</h4>
      <div className="test-checkbox-group">
        {testList.map((t, idx) => (
          <label key={idx}>
            <input type="checkbox" checked={t.required} onChange={(e) => handleTestCheckboxChange(idx, e.target.checked)} /> {t.testName}
          </label>
        ))}
      </div>

      <div className="action-buttons">
        <button onClick={handleSave} className="btn-save">✅ Save</button>
        <button onClick={() => navigate(-1)} className="btn-cancel">❌ Cancel</button>
      </div>

      {printData && (
        <div className="print-button-container">
          <button onClick={handlePrint} className="btn-print">🖨️ Print Prescription</button>
        </div>
      )}
    </div>
  );
};

export default Prescription;













