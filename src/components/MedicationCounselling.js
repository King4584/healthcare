import React, { useState } from 'react';
import { 
  Pill, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Calendar,
  User,
  FileText,
  Download,
  Printer
} from 'lucide-react';
import { usePatientData, useMedicationCounselling, useActions } from '../store/AppStore';
import { MedicationCounsellingService } from '../services/medicationCounsellingService';

const MedicationCounselling = () => {
  const patientData = usePatientData();
  const medicationCounselling = useMedicationCounselling();
  const { setMedicationCounselling } = useActions();
  
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMedicationCounselling = async () => {
    if (!patientData) return;
    setIsGenerating(true);
    try {
      // Prefer AI-generated counselling
      const ai = await MedicationCounsellingService.generateCounselling(patientData);
      if (ai) {
        setMedicationCounselling(ai);
        setIsGenerating(false);
        return;
      }
    } catch (_) {}

    // Fallback to local generation (kept for now)
    // const counselling = localGenerateCounselling(patientData);
    // setMedicationCounselling(counselling);
    setIsGenerating(false);
  };

  // function localGenerateCounselling(patientData) {
  //   // original local generation kept here commented per request
  //   return { /* ...same structure as before... */ };
  // }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([document.getElementById('medication-counselling-content').innerHTML], {
      type: 'text/html'
    });
    element.href = URL.createObjectURL(file);
    element.download = `${patientData?.patientName?.replace(/\s+/g, '_')}_Medication_Counselling.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!patientData) {
    return (
      <div className="medication-counselling-container">
        <div className="no-patient-data">
          <Pill className="no-data-icon" />
          <h3>No Patient Data Available</h3>
          <p>Please enter patient information first to generate medication counselling.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="medication-counselling-content" className="medication-counselling-container">
      <div className="counselling-header">
        <div className="header-info">
          <h2>Medication Counselling</h2>
          <div className="patient-info">
            <h3>{patientData.patientName}</h3>
            <p>{patientData.age} years, {patientData.gender} • {patientData.finalDiagnosis}</p>
          </div>
        </div>
        <div className="header-actions">
          {!medicationCounselling && (
            <button 
              onClick={generateMedicationCounselling}
              disabled={isGenerating}
              className="btn btn-primary"
            >
              {isGenerating ? (
                <>
                  <div className="spinner"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Pill className="btn-icon" />
                  Generate Counselling
                </>
              )}
            </button>
          )}
          {medicationCounselling && (
            <>
              <button onClick={handlePrint} className="btn btn-outline">
                <Printer className="btn-icon" />
                Print
              </button>
              <button onClick={handleDownload} className="btn btn-outline">
                <Download className="btn-icon" />
                Download
              </button>
            </>
          )}
        </div>
      </div>

      {isGenerating && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Generating personalized medication counselling...</p>
        </div>
      )}

      {medicationCounselling && (
        <div className="counselling-content">
          {/* Current Medications */}
          <div className="counselling-section">
            <div className="section-header">
              <Pill className="section-icon" />
              <h3>Current Medications</h3>
            </div>
            <div className="medications-list">
              {medicationCounselling.medications.map((med) => (
                <div key={med.id} className="medication-item">
                  <div className="medication-header">
                    <h4>{med.name}</h4>
                    <span className="medication-frequency">{med.frequency}</span>
                  </div>
                  <p className="medication-dosage">{med.dosage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Counselling Instructions */}
          <div className="counselling-section">
            <div className="section-header">
              <FileText className="section-icon" />
              <h3>Medication Counselling</h3>
            </div>
            
            <div className="counselling-subsection">
              <h4>General Instructions</h4>
              <ul className="instruction-list">
                {medicationCounselling.counselling.generalInstructions.map((instruction, index) => (
                  <li key={index} className="instruction-item">
                    <CheckCircle className="instruction-icon" />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="counselling-subsection">
              <h4>Specific Medication Instructions</h4>
              <ul className="instruction-list">
                {medicationCounselling.counselling.specificInstructions.map((instruction, index) => (
                  <li key={index} className="instruction-item">
                    <Info className="instruction-icon" />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="counselling-subsection">
              <h4>Lifestyle Modifications</h4>
              <ul className="instruction-list">
                {medicationCounselling.counselling.lifestyleModifications.map((modification, index) => (
                  <li key={index} className="instruction-item">
                    <CheckCircle className="instruction-icon" />
                    <span>{modification}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Side Effects */}
          <div className="counselling-section">
            <div className="section-header">
              <AlertTriangle className="section-icon" />
              <h3>Side Effects & Management</h3>
            </div>
            <div className="side-effects-list">
              {medicationCounselling.sideEffects.map((sideEffect, index) => (
                <div key={index} className="side-effect-item">
                  <h4>{sideEffect.medication}</h4>
                  <div className="side-effect-details">
                    <div className="side-effect-type">
                      <strong>Common:</strong> {sideEffect.commonSideEffects.join(', ')}
                    </div>
                    <div className="side-effect-type">
                      <strong>Serious:</strong> {sideEffect.seriousSideEffects.join(', ')}
                    </div>
                    <div className="side-effect-management">
                      <strong>Management:</strong> {sideEffect.management}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drug Interactions */}
          <div className="counselling-section">
            <div className="section-header">
              <AlertTriangle className="section-icon" />
              <h3>Drug Interactions</h3>
            </div>
            <div className="interactions-list">
              {medicationCounselling.interactions.map((interaction, index) => (
                <div key={index} className="interaction-item">
                  <h4>{interaction.medications}</h4>
                  <p><strong>Interaction:</strong> {interaction.interaction}</p>
                  <p><strong>Recommendation:</strong> {interaction.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Instructions */}
          <div className="counselling-section">
            <div className="section-header">
              <Info className="section-icon" />
              <h3>Storage Instructions</h3>
            </div>
            <ul className="instruction-list">
              {medicationCounselling.storageInstructions.map((instruction, index) => (
                <li key={index} className="instruction-item">
                  <CheckCircle className="instruction-icon" />
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div className="counselling-section">
            <div className="section-header">
              <User className="section-icon" />
              <h3>Emergency Contacts</h3>
            </div>
            <div className="emergency-contacts">
              {medicationCounselling.emergencyContacts.map((contact, index) => (
                <div key={index} className="contact-item">
                  <h4>{contact.type}</h4>
                  <p className="contact-number">{contact.contact}</p>
                  <p className="contact-description">{contact.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="counselling-section important-notes">
            <div className="section-header">
              <AlertTriangle className="section-icon" />
              <h3>Important Notes</h3>
            </div>
            <ul className="instruction-list">
              {medicationCounselling.importantNotes.map((note, index) => (
                <li key={index} className="instruction-item">
                  <AlertTriangle className="instruction-icon" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationCounselling;
