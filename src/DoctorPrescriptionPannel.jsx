import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './doctorPrescription.css';

const DoctorPrescriptionPanel = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [allMedicines, setAllMedicines] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [prescription, setPrescription] = useState({});

  useEffect(() => {
    fetchPatients();
    fetchMasterData();
  }, []);

  const fetchPatients = async () => {
    const res = await axios.get('http://localhost:5000/api/patients');
    setPatients(res.data);
  };

  const fetchMasterData = async () => {
    const medRes = await axios.get('http://localhost:5000/api/medicines');
    const testRes = await axios.get('http://localhost:5000/api/tests');
    setAllMedicines(medRes.data);
    setAllTests(testRes.data);
  };

  const handleCheckboxChange = (medicine, key) => {
    setPrescription((prev) => {
      const updated = { ...prev };
      if (!updated.medicineList) updated.medicineList = {};
      if (!updated.medicineList[medicine.name]) {
        updated.medicineList[medicine.name] = {
          ...medicine,
          days: 1,
          timing: { morning: false, lunch: false, evening: false, night: false },
        };
      }
      updated.medicineList[medicine.name].timing[key] = !updated.medicineList[medicine.name].timing[key];
      return updated;
    });
  };

  const handleDaysChange = (medicine, days) => {
    setPrescription((prev) => {
      const updated = { ...prev };
      if (updated.medicineList && updated.medicineList[medicine.name]) {
        updated.medicineList[medicine.name].days = days;
      }
      return updated;
    });
  };

  const toggleTestSelection = (test) => {
    setPrescription((prev) => {
      const updated = { ...prev };
      if (!updated.testList) updated.testList = {};
      updated.testList[test.name] = !updated.testList[test.name];
      return updated;
    });
  };

  const handleSavePrescription = async () => {
    const patient = patients.find((p) => p._id === selectedPatientId);
    if (!patient) return;

    const finalData = {
      ...patient,
      medicineList: Object.values(prescription.medicineList || {}),
      testList: Object.keys(prescription.testList || {}).map((testName) => ({
        testName,
        required: prescription.testList[testName],
      })),
    };

    try {
      await axios.put(`http://localhost:5000/api/patients/${selectedPatientId}`, finalData);
      alert("Prescription Saved ✅");
      setSelectedPatientId(null);
      setPrescription({});
    } catch (err) {
      console.error("Error saving prescription:", err);
    }
  };

  return (
    <div className="doctor-panel-container">
      <h2>🩺 Doctor Prescription Panel</h2>

      <div className="patient-selector">
        <label>Select Patient: </label>
        <select value={selectedPatientId || ''} onChange={(e) => setSelectedPatientId(e.target.value)}>
          <option value="">-- Select --</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.phone})
            </option>
          ))}
        </select>
      </div>

      {selectedPatientId && (
        <>
          <h3>💊 Select Medicines</h3>
          <table className="prescription-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Type</th>
                <th>Instruction</th>
                <th>Days</th>
                <th>Timing</th>
              </tr>
            </thead>
            <tbody>
              {allMedicines.map((med) => (
                <tr key={med.name}>
                  <td>{med.name}</td>
                  <td>{med.type}</td>
                  <td>{med.instruction}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={prescription.medicineList?.[med.name]?.days || 1}
                      onChange={(e) => handleDaysChange(med, e.target.value)}
                    />
                  </td>
                  <td>
                    {["morning", "lunch", "evening", "night"].map((time) => (
                      <label key={time}>
                        <input
                          type="checkbox"
                          checked={prescription.medicineList?.[med.name]?.timing?.[time] || false}
                          onChange={() => handleCheckboxChange(med, time)}
                        />
                        {time.charAt(0).toUpperCase()}
                      </label>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>🧪 Select Tests</h3>
          <div className="test-section">
            {allTests.map((test) => (
              <label key={test.name} className="test-checkbox">
                <input
                  type="checkbox"
                  checked={prescription.testList?.[test.name] || false}
                  onChange={() => toggleTestSelection(test)}
                />
                {test.name}
              </label>
            ))}
          </div>

          <button className="btn-save" onClick={handleSavePrescription}>✅ Save Prescription</button>
        </>
      )}
    </div>
  );
};

export default DoctorPrescriptionPanel;
