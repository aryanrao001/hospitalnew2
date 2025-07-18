import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Prescription.css";

const defaultTestList = [
  "Blood Sugar",
  "Blood Pressure",
  "CBC",
  "LFT",
  "KFT",
  "ECG",
  "X-Ray",
  "Urine Test",
  "Lipid Profile",
  "Thyroid Panel"
];

const initializeDose = () => ({
  morning: { bf: false, af: false },
  lunch: { bf: false, af: false },
  evening: { bf: false, af: false },
  night: { bf: false, af: false },
});

const Prescription = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { patients, popupPatientId } = location.state || {};
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState("");
  const [medicineList, setMedicineList] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [testList, setTestList] = useState(
    defaultTestList.map((name) => ({ testName: name, required: false }))
  );

  const selectedPatient = patients?.find(p => p._id === popupPatientId);

  useEffect(() => {
    axios.get("http://localhost:5000/api/medicines")
      .then(res => {
        const allDiseases = [...new Set(res.data.map(m => m.disease.toLowerCase()))];
        setDiseases(allDiseases);
      })
      .catch(err => console.error("Error fetching diseases", err));
  }, []);

  useEffect(() => {
    if (selectedDisease) {
      axios.get(`http://localhost:5000/api/medicines?disease=${selectedDisease}`)
        .then(res => {
          const meds = Array.isArray(res.data) ? res.data : [res.data];
          const editable = meds.map(med => ({
            ...med,
            editing: false,
            dose: med.dose || initializeDose()
          }));
          setMedicineList(editable);
        })
        .catch(err => console.error("Error fetching medicines", err));
    }
  }, [selectedDisease]);

  const toggleMedicineSelection = (id) => {
    setSelectedMedicines(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const toggleEditMode = (index) => {
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
      await axios.put(`http://localhost:5000/api/patients/${selectedPatient._id}`, {
        medicineList: formattedMeds,
        testList: formattedTests
      });

      alert("✅ Prescription saved successfully.");
      navigate("/dashboard/patient-list");
    } catch (err) {
      console.error("❌ Save Error:", err.response?.data || err.message);
      alert("❌ Failed to save prescription. Check console for details.");
    }
  };

  if (!selectedPatient) {
    return <p>No patient selected.</p>;
  }

  return (
    <div className="prescription-container">
      <h2 className="form-header">🩺 Prescription Form</h2>

      <div className="patient-info">
        <p><strong>Name:</strong> {selectedPatient.name}</p>
        <p><strong>Phone:</strong> {selectedPatient.phone}</p>
        <p><strong>Gender:</strong> {selectedPatient.gender}</p>
        <p><strong>Address:</strong> {selectedPatient.address}</p>
      </div>

      <div>
        <label><strong>Select Disease:</strong></label>
        <select value={selectedDisease} onChange={(e) => setSelectedDisease(e.target.value)}>
          <option value="">-- Select Disease --</option>
          {diseases.map((dis, idx) => (
            <option key={idx} value={dis}>{dis}</option>
          ))}
        </select>
      </div>

      {medicineList.length > 0 && (
        <>
          <h4>💊 Suggested Medicines</h4>
          <table className="medicine-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Days</th>
                <th>Dose (BF / AF)</th>
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
                        type="text"
                        value={med.medicineName}
                        onChange={(e) => handleMedicineFieldChange(idx, "medicineName", e.target.value)}
                      />
                    ) : (
                      med.medicineName
                    )}
                  </td>
                  <td>
                    {med.editing ? (
                      <input
                        type="text"
                        value={med.medicineType}
                        onChange={(e) => handleMedicineFieldChange(idx, "medicineType", e.target.value)}
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
                      onChange={(e) => handleMedicineFieldChange(idx, "days", e.target.value)}
                    />
                  </td>
                  <td>
                    {Object.keys(med.dose).map((time) => (
                      <div key={time}>
                        <strong>{time.charAt(0).toUpperCase() + time.slice(1)}:</strong>{" "}
                        <label>
                          <input
                            type="checkbox"
                            checked={med.dose[time].bf}
                            onChange={(e) => handleDoseChange(idx, time, "bf", e.target.checked)}
                          /> BF
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={med.dose[time].af}
                            onChange={(e) => handleDoseChange(idx, time, "af", e.target.checked)}
                          /> AF
                        </label>
                      </div>
                    ))}
                  </td>
                  <td>
                    <button onClick={() => toggleEditMode(idx)}>
                      {med.editing ? "💾 Save" : "✏️ Edit"}
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
<h4>🧪 Common Tests</h4>
<div className="test-checkbox-group">
  {testList.map((t, idx) => (
    <label key={idx} className="test-checkbox">
      <input
        type="checkbox"
        checked={t.required}
        onChange={(e) => handleTestCheckboxChange(idx, e.target.checked)}
      />
      {t.testName}
    </label>
  ))}
</div>


      <div className="action-buttons">
        <button onClick={handleSave} className="btn-save">✅ Save</button>
        <button onClick={() => navigate(-1)} className="btn-cancel">❌ Cancel</button>
      </div>
    </div>
  );
};

export default Prescription;











