import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  // Patient data
  patientData: null,
  
  // Diet plan
  dietPlan: null,
  
  // Medication counselling
  medicationCounselling: null,
  
  // Follow-up appointments
  followUpAppointments: [],
  
  // Physiotherapy sessions
  physiotherapySessions: [],
  
  // UI state
  loading: false,
  error: null,
  
  // Form state
  formData: {
    hospitalName: 'XYZ Multispeciality Hospital, Palliative Care Unit',
    patientName: 'Mr. Rajesh Sharma',
    age: '68',
    gender: 'Male',
    uhidNo: '123456',
    ipdNo: 'PCU-2025/045',
    dateOfAdmission: '15-09-2025',
    dateOfDischarge: '03-10-2025',
    weightAtDischarge: '54',
    presentingComplaints: 'Severe generalized weakness, reduced oral intake, abdominal pain, breathlessness',
    historyOfPresentIllness: 'Known case of advanced carcinoma pancreas with metastases, admitted with progressive weakness and pain',
    pastMedicalHistory: 'Type 2 Diabetes Mellitus (15 yrs), Hypertension (10 yrs), COPD',
    finalDiagnosis: 'Advanced Carcinoma Pancreas with Liver Metastases – Palliative care case',
    clinicalFindings: 'Conscious, oriented, weak; ECOG: 3; BP: 110/70 mmHg; Pulse: 94/min; SpO₂: 94%',
    investigations: 'CBC: Hb 9.2 g/dl; LFT: deranged; CXR: COPD changes',
    treatmentGiven: 'Morphine, oxygen therapy, nebulisation, counselling, physiotherapy',
    conditionAtDischarge: 'Stable but terminal, pain partially controlled, oral intake maintained',
    medicationsOnDischarge: '1. Morphine 10mg BD\n2. Paracetamol 500mg SOS\n3. Amlodipine 5mg OD\n4. Metformin 500mg BD\n5. Salbutamol inhaler SOS',
    followUpInstructions: 'Follow up at Palliative OPD in 2 weeks or earlier if worsening. Emergency contact provided',
    remarks: 'Prognosis explained, family counselled for home-based palliative care'
  },
  
  // Application settings
  settings: {
    theme: 'light',
    language: 'en',
    autoSave: true
  },
  
  // History for undo/redo functionality
  history: [],
  historyIndex: -1
};

// Action types
export const ActionTypes = {
  // Patient data actions
  SET_PATIENT_DATA: 'SET_PATIENT_DATA',
  CLEAR_PATIENT_DATA: 'CLEAR_PATIENT_DATA',
  
  // Diet plan actions
  SET_DIET_PLAN: 'SET_DIET_PLAN',
  CLEAR_DIET_PLAN: 'CLEAR_DIET_PLAN',
  
  // Medication counselling actions
  SET_MEDICATION_COUNSELLING: 'SET_MEDICATION_COUNSELLING',
  CLEAR_MEDICATION_COUNSELLING: 'CLEAR_MEDICATION_COUNSELLING',
  
  // Follow-up appointment actions
  ADD_FOLLOW_UP_APPOINTMENT: 'ADD_FOLLOW_UP_APPOINTMENT',
  UPDATE_FOLLOW_UP_APPOINTMENT: 'UPDATE_FOLLOW_UP_APPOINTMENT',
  DELETE_FOLLOW_UP_APPOINTMENT: 'DELETE_FOLLOW_UP_APPOINTMENT',
  CLEAR_FOLLOW_UP_APPOINTMENTS: 'CLEAR_FOLLOW_UP_APPOINTMENTS',
  
  // Physiotherapy actions
  ADD_PHYSIOTHERAPY_SESSION: 'ADD_PHYSIOTHERAPY_SESSION',
  UPDATE_PHYSIOTHERAPY_SESSION: 'UPDATE_PHYSIOTHERAPY_SESSION',
  DELETE_PHYSIOTHERAPY_SESSION: 'DELETE_PHYSIOTHERAPY_SESSION',
  CLEAR_PHYSIOTHERAPY_SESSIONS: 'CLEAR_PHYSIOTHERAPY_SESSIONS',
  
  // UI actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Form actions
  UPDATE_FORM_FIELD: 'UPDATE_FORM_FIELD',
  RESET_FORM: 'RESET_FORM',
  SET_FORM_DATA: 'SET_FORM_DATA',
  
  // Settings actions
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  
  // History actions
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  UNDO: 'UNDO',
  REDO: 'REDO',
  
  // Reset all
  RESET_ALL: 'RESET_ALL'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_PATIENT_DATA:
      return {
        ...state,
        patientData: action.payload,
        error: null
      };
      
    case ActionTypes.CLEAR_PATIENT_DATA:
      return {
        ...state,
        patientData: null
      };
      
    case ActionTypes.SET_DIET_PLAN:
      return {
        ...state,
        dietPlan: action.payload,
        loading: false,
        error: null
      };
      
    case ActionTypes.CLEAR_DIET_PLAN:
      return {
        ...state,
        dietPlan: null
      };
      
    case ActionTypes.SET_MEDICATION_COUNSELLING:
      return {
        ...state,
        medicationCounselling: action.payload
      };
      
    case ActionTypes.CLEAR_MEDICATION_COUNSELLING:
      return {
        ...state,
        medicationCounselling: null
      };
      
    case ActionTypes.ADD_FOLLOW_UP_APPOINTMENT:
      return {
        ...state,
        followUpAppointments: [...state.followUpAppointments, action.payload]
      };
      
    case ActionTypes.UPDATE_FOLLOW_UP_APPOINTMENT:
      return {
        ...state,
        followUpAppointments: state.followUpAppointments.map(appointment =>
          appointment.id === action.payload.id ? action.payload : appointment
        )
      };
      
    case ActionTypes.DELETE_FOLLOW_UP_APPOINTMENT:
      return {
        ...state,
        followUpAppointments: state.followUpAppointments.filter(
          appointment => appointment.id !== action.payload
        )
      };
      
    case ActionTypes.CLEAR_FOLLOW_UP_APPOINTMENTS:
      return {
        ...state,
        followUpAppointments: []
      };
      
    case ActionTypes.ADD_PHYSIOTHERAPY_SESSION:
      return {
        ...state,
        physiotherapySessions: [...state.physiotherapySessions, action.payload]
      };
      
    case ActionTypes.UPDATE_PHYSIOTHERAPY_SESSION:
      return {
        ...state,
        physiotherapySessions: state.physiotherapySessions.map(session =>
          session.id === action.payload.id ? action.payload : session
        )
      };
      
    case ActionTypes.DELETE_PHYSIOTHERAPY_SESSION:
      return {
        ...state,
        physiotherapySessions: state.physiotherapySessions.filter(
          session => session.id !== action.payload
        )
      };
      
    case ActionTypes.CLEAR_PHYSIOTHERAPY_SESSIONS:
      return {
        ...state,
        physiotherapySessions: []
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case ActionTypes.UPDATE_FORM_FIELD:
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.field]: action.payload.value
        }
      };
      
    case ActionTypes.RESET_FORM:
      return {
        ...state,
        formData: initialState.formData
      };
      
    case ActionTypes.SET_FORM_DATA:
      return {
        ...state,
        formData: action.payload
      };
      
    case ActionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
      
    case ActionTypes.ADD_TO_HISTORY:
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(action.payload);
      return {
        ...state,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
      
    case ActionTypes.UNDO:
      if (state.historyIndex > 0) {
        return {
          ...state,
          historyIndex: state.historyIndex - 1,
          formData: state.history[state.historyIndex - 1]
        };
      }
      return state;
      
    case ActionTypes.REDO:
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          historyIndex: state.historyIndex + 1,
          formData: state.history[state.historyIndex + 1]
        };
      }
      return state;
      
    case ActionTypes.RESET_ALL:
      return initialState;
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the store
export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};

// Selector hooks for specific parts of state
export const usePatientData = () => {
  const { state } = useAppStore();
  return state.patientData;
};

export const useDietPlan = () => {
  const { state } = useAppStore();
  return state.dietPlan;
};

export const useFormData = () => {
  const { state } = useAppStore();
  return state.formData;
};

export const useLoading = () => {
  const { state } = useAppStore();
  return state.loading;
};

export const useError = () => {
  const { state } = useAppStore();
  return state.error;
};

export const useSettings = () => {
  const { state } = useAppStore();
  return state.settings;
};

export const useHistory = () => {
  const { state } = useAppStore();
  return {
    history: state.history,
    historyIndex: state.historyIndex,
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1
  };
};

export const useMedicationCounselling = () => {
  const { state } = useAppStore();
  return state.medicationCounselling;
};

export const useFollowUpAppointments = () => {
  const { state } = useAppStore();
  return state.followUpAppointments;
};

export const usePhysiotherapySessions = () => {
  const { state } = useAppStore();
  return state.physiotherapySessions;
};

// Action creators
export const useActions = () => {
  const { dispatch } = useAppStore();

  return {
    // Patient data actions
    setPatientData: (data) => dispatch({ type: ActionTypes.SET_PATIENT_DATA, payload: data }),
    clearPatientData: () => dispatch({ type: ActionTypes.CLEAR_PATIENT_DATA }),
    
    // Diet plan actions
    setDietPlan: (plan) => dispatch({ type: ActionTypes.SET_DIET_PLAN, payload: plan }),
    clearDietPlan: () => dispatch({ type: ActionTypes.CLEAR_DIET_PLAN }),
    
    // Medication counselling actions
    setMedicationCounselling: (counselling) => dispatch({ type: ActionTypes.SET_MEDICATION_COUNSELLING, payload: counselling }),
    clearMedicationCounselling: () => dispatch({ type: ActionTypes.CLEAR_MEDICATION_COUNSELLING }),
    
    // Follow-up appointment actions
    addFollowUpAppointment: (appointment) => dispatch({ type: ActionTypes.ADD_FOLLOW_UP_APPOINTMENT, payload: appointment }),
    updateFollowUpAppointment: (appointment) => dispatch({ type: ActionTypes.UPDATE_FOLLOW_UP_APPOINTMENT, payload: appointment }),
    deleteFollowUpAppointment: (id) => dispatch({ type: ActionTypes.DELETE_FOLLOW_UP_APPOINTMENT, payload: id }),
    clearFollowUpAppointments: () => dispatch({ type: ActionTypes.CLEAR_FOLLOW_UP_APPOINTMENTS }),
    
    // Physiotherapy actions
    addPhysiotherapySession: (session) => dispatch({ type: ActionTypes.ADD_PHYSIOTHERAPY_SESSION, payload: session }),
    updatePhysiotherapySession: (session) => dispatch({ type: ActionTypes.UPDATE_PHYSIOTHERAPY_SESSION, payload: session }),
    deletePhysiotherapySession: (id) => dispatch({ type: ActionTypes.DELETE_PHYSIOTHERAPY_SESSION, payload: id }),
    clearPhysiotherapySessions: () => dispatch({ type: ActionTypes.CLEAR_PHYSIOTHERAPY_SESSIONS }),
    
    // UI actions
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    
    // Form actions
    updateFormField: (field, value) => dispatch({ 
      type: ActionTypes.UPDATE_FORM_FIELD, 
      payload: { field, value } 
    }),
    resetForm: () => dispatch({ type: ActionTypes.RESET_FORM }),
    setFormData: (data) => dispatch({ type: ActionTypes.SET_FORM_DATA, payload: data }),
    
    // Settings actions
    updateSettings: (settings) => dispatch({ 
      type: ActionTypes.UPDATE_SETTINGS, 
      payload: settings 
    }),
    
    // History actions
    addToHistory: (data) => dispatch({ type: ActionTypes.ADD_TO_HISTORY, payload: data }),
    undo: () => dispatch({ type: ActionTypes.UNDO }),
    redo: () => dispatch({ type: ActionTypes.REDO }),
    
    // Reset all
    resetAll: () => dispatch({ type: ActionTypes.RESET_ALL })
  };
};

export default AppContext;
