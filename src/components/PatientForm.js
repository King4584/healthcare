import React from 'react';
import { FileText, Send } from 'lucide-react';
import { useFormData, useActions } from '../store/AppStore';

const PatientForm = ({ onSubmit }) => {
  // Get form data from store
  const formData = useFormData();
  
  // Get actions from store
  const { updateFormField } = useActions();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formSections = [
    {
      title: 'Hospital & Patient Information',
      fields: [
        { name: 'hospitalName', label: 'Hospital Name', type: 'text' },
        { name: 'patientName', label: 'Patient Name', type: 'text' },
        { name: 'age', label: 'Age', type: 'text' },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { name: 'uhidNo', label: 'UHID No.', type: 'text' },
        { name: 'ipdNo', label: 'IPD No.', type: 'text' }
      ]
    },
    {
      title: 'Admission & Discharge Details',
      fields: [
        { name: 'dateOfAdmission', label: 'Date of Admission', type: 'text' },
        { name: 'dateOfDischarge', label: 'Date of Discharge', type: 'text' },
        { name: 'weightAtDischarge', label: 'Weight at Discharge (kg)', type: 'text' }
      ]
    },
    {
      title: 'Medical History & Diagnosis',
      fields: [
        { name: 'presentingComplaints', label: 'Presenting Complaints', type: 'textarea' },
        { name: 'historyOfPresentIllness', label: 'History of Present Illness', type: 'textarea' },
        { name: 'pastMedicalHistory', label: 'Past Medical History / Comorbidities', type: 'textarea' },
        { name: 'finalDiagnosis', label: 'Final Diagnosis', type: 'textarea' }
      ]
    },
    {
      title: 'Clinical Findings & Treatment',
      fields: [
        { name: 'clinicalFindings', label: 'Clinical Findings on Admission', type: 'textarea' },
        { name: 'investigations', label: 'Investigations', type: 'textarea' },
        { name: 'treatmentGiven', label: 'Treatment Given During Hospital Stay', type: 'textarea' },
        { name: 'conditionAtDischarge', label: 'Condition at Discharge', type: 'textarea' }
      ]
    },
    {
      title: 'Medications & Follow-up',
      fields: [
        { name: 'medicationsOnDischarge', label: 'Medications on Discharge', type: 'textarea' },
        { name: 'followUpInstructions', label: 'Follow-up Instructions', type: 'textarea' },
        { name: 'remarks', label: 'Remarks', type: 'textarea' }
      ]
    }
  ];

  return (
    <div className="patient-form-container">
      <div className="form-header">
        <FileText className="form-icon" />
        <h2>Patient Medical Data</h2>
        <p>Enter patient information to generate a personalized diet plan</p>
      </div>

      <form onSubmit={handleSubmit} className="patient-form">
        {formSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="form-section">
            <h3 className="section-title">{section.title}</h3>
            <div className="form-grid">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="form-group">
                  <label className="form-label" htmlFor={field.name}>
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="form-textarea"
                      rows="3"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="form-input"
                    >
                      {field.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="form-input"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <Send className="btn-icon" />
            Generate Diet Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
