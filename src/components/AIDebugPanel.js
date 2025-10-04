import React, { useState } from 'react';
import { Brain, Database, AlertCircle, CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import { usePatientData, useDietPlan, useMedicationCounselling } from '../store/AppStore';

const AIDebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const patientData = usePatientData();
  const dietPlan = useDietPlan();
  const medicationCounselling = useMedicationCounselling();

  const getStatusIcon = (isAI) => {
    return isAI ? <CheckCircle className="status-icon ai" /> : <AlertCircle className="status-icon fallback" />;
  };

  const getStatusText = (isAI) => {
    return isAI ? 'AI Generated' : 'Hardcoded Fallback';
  };

  const getStatusColor = (isAI) => {
    return isAI ? '#10b981' : '#f59e0b';
  };

  if (!isVisible) {
    return (
      <button 
        className="ai-debug-toggle"
        onClick={() => setIsVisible(true)}
        title="Show AI Debug Panel"
      >
        <Brain className="debug-icon" />
      </button>
    );
  }

  return (
    <div className="ai-debug-panel">
      <div className="debug-header">
        <Brain className="debug-icon" />
        <h3>AI Debug Panel</h3>
        <div className="debug-controls">
          <button 
            className="debug-toggle-btn"
            onClick={() => setIsVisible(false)}
            title="Hide Panel"
          >
            <EyeOff className="debug-icon" />
          </button>
        </div>
      </div>
      
      <div className="debug-content">
        <div className="debug-section">
          <h4>Patient Data Status</h4>
          <div className="status-item">
            <Database className="status-icon" />
            <span>{patientData ? '✅ Available' : '❌ Not Available'}</span>
          </div>
        </div>

        <div className="debug-section">
          <h4>Diet Plan Source</h4>
          {dietPlan ? (
            <div className="status-item">
              {getStatusIcon(dietPlan._aiGenerated)}
              <span style={{ color: getStatusColor(dietPlan._aiGenerated) }}>
                {getStatusText(dietPlan._aiGenerated)}
              </span>
              <span className="timestamp">
                {dietPlan._generatedAt ? new Date(dietPlan._generatedAt).toLocaleTimeString() : 'Unknown'}
              </span>
            </div>
          ) : (
            <div className="status-item">
              <AlertCircle className="status-icon" />
              <span>Not Generated</span>
            </div>
          )}
        </div>

        <div className="debug-section">
          <h4>Medication Counselling Source</h4>
          {medicationCounselling ? (
            <div className="status-item">
              {getStatusIcon(medicationCounselling._aiGenerated)}
              <span style={{ color: getStatusColor(medicationCounselling._aiGenerated) }}>
                {getStatusText(medicationCounselling._aiGenerated)}
              </span>
              <span className="timestamp">
                {medicationCounselling._generatedAt ? new Date(medicationCounselling._generatedAt).toLocaleTimeString() : 'Unknown'}
              </span>
            </div>
          ) : (
            <div className="status-item">
              <AlertCircle className="status-icon" />
              <span>Not Generated</span>
            </div>
          )}
        </div>

        <div className="debug-section">
          <h4>Environment Check</h4>
          <div className="status-item">
            <span>Puter.js: </span>
            <span style={{ color: (typeof window !== 'undefined' && window.puter && window.puter.ai) ? '#10b981' : '#ef4444' }}>
              {typeof window !== 'undefined' && window.puter && window.puter.ai ? '✅ Available' : '❌ Not Available'}
            </span>
          </div>
          <div className="status-item">
            <span>API Key: </span>
            <span style={{ color: '#6b7280' }}>
              Not Required (Using Puter.js)
            </span>
          </div>
        </div>

        <div className="debug-section">
          <h4>Console Logs</h4>
          <div className="console-info">
            <p>Open browser console (F12) to see detailed AI call logs:</p>
            <ul>
              <li>🤖 Puter.js AI calls and responses</li>
              <li>⚠️ Fallback triggers</li>
              <li>🔑 Puter.js availability</li>
              <li>📋 Hardcoded generator usage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDebugPanel;
