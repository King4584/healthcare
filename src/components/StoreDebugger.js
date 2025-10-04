import React, { useState } from 'react';
import { Eye, EyeOff, Download, Trash2, RotateCcw } from 'lucide-react';
import { useAppStore, useActions, useHistory } from '../store/AppStore';
import { DietPlanService } from '../services/dietPlanService';

const StoreDebugger = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { state } = useAppStore();
  const { resetAll, clearPatientData, clearDietPlan } = useActions();
  const { history, canUndo, canRedo, undo, redo } = useHistory();

  const exportStoreData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'store_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      resetAll();
    }
  };

  const clearPatient = () => {
    if (window.confirm('Are you sure you want to clear patient data?')) {
      clearPatientData();
    }
  };

  const clearDiet = () => {
    if (window.confirm('Are you sure you want to clear diet plan?')) {
      clearDietPlan();
    }
  };

  if (!isVisible) {
    return (
      <div className="store-debugger-toggle">
        <button 
          onClick={() => setIsVisible(true)}
          className="btn btn-debug"
          title="Show Store Debugger"
        >
          <Eye className="btn-icon" />
          Debug Store
        </button>
      </div>
    );
  }

  return (
    <div className="store-debugger">
      <div className="debugger-header">
        <h3>Store Debugger</h3>
        <div className="debugger-actions">
          <button onClick={exportStoreData} className="btn btn-small">
            <Download className="btn-icon" />
            Export
          </button>
          <button onClick={clearAllData} className="btn btn-small btn-danger">
            <Trash2 className="btn-icon" />
            Clear All
          </button>
          <button onClick={() => setIsVisible(false)} className="btn btn-small">
            <EyeOff className="btn-icon" />
            Hide
          </button>
        </div>
      </div>

      <div className="debugger-content">
        <div className="debug-section">
          <h4>Current State</h4>
          <div className="state-info">
            <div className="state-item">
              <strong>Patient Data:</strong> {state.patientData ? '✓ Present' : '✗ None'}
            </div>
            <div className="state-item">
              <strong>Diet Plan:</strong> {state.dietPlan ? '✓ Present' : '✗ None'}
            </div>
            <div className="state-item">
              <strong>Loading:</strong> {state.loading ? '✓ Yes' : '✗ No'}
            </div>
            <div className="state-item">
              <strong>Error:</strong> {state.error || 'None'}
            </div>
          </div>
        </div>

        <div className="debug-section">
          <h4>Form Data</h4>
          <div className="form-info">
            <div className="form-item">
              <strong>Patient Name:</strong> {state.formData.patientName}
            </div>
            <div className="form-item">
              <strong>Age/Gender:</strong> {state.formData.age} / {state.formData.gender}
            </div>
            <div className="form-item">
              <strong>Weight:</strong> {state.formData.weightAtDischarge} kg
            </div>
            <div className="form-item">
              <strong>Diagnosis:</strong> {state.formData.finalDiagnosis}
            </div>
          </div>
        </div>

        <div className="debug-section">
          <h4>History</h4>
          <div className="history-info">
            <div className="history-item">
              <strong>History Length:</strong> {history.length}
            </div>
            <div className="history-item">
              <strong>Current Index:</strong> {state.historyIndex}
            </div>
            <div className="history-actions">
              <button 
                onClick={undo} 
                disabled={!canUndo}
                className="btn btn-small"
              >
                <RotateCcw className="btn-icon" />
                Undo
              </button>
              <button 
                onClick={redo} 
                disabled={!canRedo}
                className="btn btn-small"
              >
                <RotateCcw className="btn-icon" style={{ transform: 'scaleX(-1)' }} />
                Redo
              </button>
            </div>
          </div>
        </div>

        <div className="debug-section">
          <h4>Quick Actions</h4>
          <div className="quick-actions">
            <button onClick={clearPatient} className="btn btn-small btn-warning">
              Clear Patient
            </button>
            <button onClick={clearDiet} className="btn btn-small btn-warning">
              Clear Diet
            </button>
          </div>
        </div>

        <div className="debug-section">
          <h4>Raw State (JSON)</h4>
          <pre className="json-preview">
            {JSON.stringify(state, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default StoreDebugger;
