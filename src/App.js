import React from 'react';
import { Heart, Stethoscope, Utensils, User, Calendar, Scale, Pill } from 'lucide-react';
import PatientForm from './components/PatientForm';
import DietPlan from './components/DietPlan';
import MedicationCounselling from './components/MedicationCounselling';
import FollowUpAppointments from './components/FollowUpAppointments';
import FollowUpPhysiotherapy from './components/FollowUpPhysiotherapy';
import StoreDebugger from './components/StoreDebugger';
import AIDebugPanel from './components/AIDebugPanel';
import { usePatientData, useDietPlan, useLoading, useError, useActions } from './store/AppStore';
import { DietPlanService } from './services/dietPlanService';
import './App.css';

function App() {
  // Get state from store
  const patientData = usePatientData();
  const dietPlan = useDietPlan();
  const loading = useLoading();
  const error = useError();
  
  // Get actions from store
  const {
    setPatientData,
    setDietPlan,
    setLoading,
    setError,
    clearError,
    clearPatientData,
    clearDietPlan
  } = useActions();

  // State for active tab
  const [activeTab, setActiveTab] = React.useState('diet');

  const handlePatientSubmit = async (data) => {
    setPatientData(data);
    setLoading(true);
    clearError();
    
    try {
      // Use the service to generate diet plan
      const generatedDietPlan = await DietPlanService.generateDietPlan(data);
      setDietPlan(generatedDietPlan);
      
      // Save to localStorage for persistence
      DietPlanService.saveDietPlanToStorage(generatedDietPlan);
    } catch (err) {
      setError('Failed to generate diet plan. Please try again.');
    }
  };

  const handleReset = () => {
    clearPatientData();
    clearDietPlan();
    clearError();
    setActiveTab('diet');
  };

  const tabs = [
    { id: 'diet', label: 'Diet Plan', icon: Utensils },
    { id: 'medication', label: 'Medication Counselling', icon: Pill },
    { id: 'appointments', label: 'Follow-up Appointments', icon: Calendar },
    { id: 'physiotherapy', label: 'Physiotherapy', icon: Stethoscope }
  ];

  return (
    <div className="App">
      <StoreDebugger />
      <AIDebugPanel />
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Heart className="logo-icon" />
              <h1>HealthCare Diet Planner</h1>
            </div>
            <p className="tagline">AI-Powered Personalized Nutrition Plans</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {!patientData ? (
            <div className="welcome-section">
              <div className="welcome-card">
                <Stethoscope className="welcome-icon" />
                <h2>Welcome to HealthCare Diet Planner</h2>
                <p>Generate personalized diet plans based on patient medical data using advanced AI technology.</p>
                <div className="features">
                  <div className="feature">
                    <User className="feature-icon" />
                    <span>Patient Data Analysis</span>
                  </div>
                  <div className="feature">
                    <Utensils className="feature-icon" />
                    <span>Personalized Meal Plans</span>
                  </div>
                  <div className="feature">
                    <Pill className="feature-icon" />
                    <span>Medical Condition Consideration</span>
                  </div>
                </div>
              </div>
              <PatientForm onSubmit={handlePatientSubmit} />
            </div>
          ) : (
            <div className="results-section">
              <div className="patient-summary">
                <h2>Patient Summary</h2>
                <div className="summary-grid">
                  <div className="summary-item">
                    <User className="summary-icon" />
                    <div>
                      <strong>{patientData.patientName}</strong>
                      <p>{patientData.age} years, {patientData.gender}</p>
                    </div>
                  </div>
                  <div className="summary-item">
                    <Scale className="summary-icon" />
                    <div>
                      <strong>Weight at Discharge</strong>
                      <p>{patientData.weightAtDischarge} kg</p>
                    </div>
                  </div>
                  <div className="summary-item">
                    <Calendar className="summary-icon" />
                    <div>
                      <strong>Hospital Stay</strong>
                      <p>{patientData.dateOfAdmission} to {patientData.dateOfDischarge}</p>
                    </div>
                  </div>
                </div>
              </div>

              {loading && (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Generating personalized diet plan...</p>
                </div>
              )}

              {error && (
                <div className="error">
                  {error}
                </div>
              )}

              {/* Tab Navigation */}
              <div className="tab-navigation">
                {tabs.map(tab => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    >
                      <IconComponent className="tab-icon" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'diet' && dietPlan && !loading && (
                  <DietPlan dietPlan={dietPlan} />
                )}
                
                {activeTab === 'medication' && (
                  <MedicationCounselling />
                )}
                
                {activeTab === 'appointments' && (
                  <FollowUpAppointments />
                )}
                
                {activeTab === 'physiotherapy' && (
                  <FollowUpPhysiotherapy />
                )}
              </div>

              <button 
                className="btn btn-secondary" 
                onClick={handleReset}
              >
                Generate New Plan
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
