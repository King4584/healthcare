# Centralized Store Documentation

## Overview

The HealthCare Diet Planner now uses a centralized state management system built with React Context API and useReducer. This provides Redux-like functionality with a simpler setup, allowing you to manage all application state from a single source of truth.

## Store Structure

### State Shape
```javascript
{
  // Patient data
  patientData: null,
  
  // Diet plan
  dietPlan: null,
  
  // UI state
  loading: false,
  error: null,
  
  // Form state (pre-filled with sample data)
  formData: {
    hospitalName: 'XYZ Multispeciality Hospital, Palliative Care Unit',
    patientName: 'Mr. Rajesh Sharma',
    age: '68',
    gender: 'Male',
    // ... all form fields
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
}
```

## Available Hooks

### 1. Main Store Hook
```javascript
import { useAppStore } from './store/AppStore';

const { state, dispatch } = useAppStore();
```

### 2. Selector Hooks (Recommended)
```javascript
import { 
  usePatientData, 
  useDietPlan, 
  useFormData, 
  useLoading, 
  useError, 
  useSettings,
  useHistory 
} from './store/AppStore';

// Get specific parts of state
const patientData = usePatientData();
const dietPlan = useDietPlan();
const formData = useFormData();
const loading = useLoading();
const error = useError();
const settings = useSettings();
const { history, canUndo, canRedo } = useHistory();
```

### 3. Actions Hook
```javascript
import { useActions } from './store/AppStore';

const {
  setPatientData,
  clearPatientData,
  setDietPlan,
  clearDietPlan,
  setLoading,
  setError,
  clearError,
  updateFormField,
  resetForm,
  setFormData,
  updateSettings,
  addToHistory,
  undo,
  redo,
  resetAll
} = useActions();
```

## Action Types

### Patient Data Actions
- `SET_PATIENT_DATA` - Set patient data
- `CLEAR_PATIENT_DATA` - Clear patient data

### Diet Plan Actions
- `SET_DIET_PLAN` - Set diet plan
- `CLEAR_DIET_PLAN` - Clear diet plan

### UI Actions
- `SET_LOADING` - Set loading state
- `SET_ERROR` - Set error message
- `CLEAR_ERROR` - Clear error message

### Form Actions
- `UPDATE_FORM_FIELD` - Update a single form field
- `RESET_FORM` - Reset form to initial state
- `SET_FORM_DATA` - Set entire form data

### Settings Actions
- `UPDATE_SETTINGS` - Update application settings

### History Actions
- `ADD_TO_HISTORY` - Add state to history
- `UNDO` - Undo last action
- `REDO` - Redo last undone action

### Reset Actions
- `RESET_ALL` - Reset entire application state

## Usage Examples

### 1. Updating Form Data
```javascript
import { useActions } from './store/AppStore';

const MyComponent = () => {
  const { updateFormField } = useActions();
  
  const handleInputChange = (field, value) => {
    updateFormField(field, value);
  };
  
  return (
    <input 
      onChange={(e) => handleInputChange('patientName', e.target.value)}
    />
  );
};
```

### 2. Generating Diet Plan
```javascript
import { useActions, useFormData } from './store/AppStore';
import { DietPlanService } from './services/dietPlanService';

const DietGenerator = () => {
  const formData = useFormData();
  const { setPatientData, setDietPlan, setLoading, setError } = useActions();
  
  const generatePlan = async () => {
    setPatientData(formData);
    setLoading(true);
    
    try {
      const dietPlan = await DietPlanService.generateDietPlan(formData);
      setDietPlan(dietPlan);
    } catch (error) {
      setError('Failed to generate diet plan');
    }
  };
  
  return <button onClick={generatePlan}>Generate Plan</button>;
};
```

### 3. Using History (Undo/Redo)
```javascript
import { useHistory, useActions } from './store/AppStore';

const HistoryControls = () => {
  const { canUndo, canRedo } = useHistory();
  const { undo, redo, addToHistory } = useActions();
  
  const saveToHistory = (data) => {
    addToHistory(data);
  };
  
  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
    </div>
  );
};
```

### 4. Accessing Store Data
```javascript
import { usePatientData, useDietPlan, useFormData } from './store/AppStore';

const PatientSummary = () => {
  const patientData = usePatientData();
  const dietPlan = useDietPlan();
  const formData = useFormData();
  
  return (
    <div>
      <h2>{patientData?.patientName || formData.patientName}</h2>
      {dietPlan && <p>Diet plan generated successfully!</p>}
    </div>
  );
};
```

## Store Debugger

The application includes a built-in store debugger that you can access by clicking the "Debug Store" button in the top-right corner. This debugger allows you to:

- View current state
- See form data
- Check history
- Export store data
- Clear specific parts of the store
- Perform undo/redo operations

## Services Integration

### DietPlanService
The `DietPlanService` class provides methods for:
- `generateDietPlan(patientData)` - Generate diet plan
- `saveDietPlanToStorage(dietPlan)` - Save to localStorage
- `getSavedDietPlans()` - Retrieve saved plans
- `deleteDietPlan(id)` - Delete saved plan
- `exportDietPlan(dietPlan)` - Export as JSON

## Best Practices

### 1. Use Selector Hooks
Instead of accessing the entire state, use specific selector hooks:
```javascript
// ✅ Good
const patientData = usePatientData();

// ❌ Avoid
const { state } = useAppStore();
const patientData = state.patientData;
```

### 2. Use Actions Hook
Always use the actions hook for dispatching actions:
```javascript
// ✅ Good
const { setPatientData } = useActions();
setPatientData(data);

// ❌ Avoid
const { dispatch } = useAppStore();
dispatch({ type: 'SET_PATIENT_DATA', payload: data });
```

### 3. Handle Loading States
Always set loading states when performing async operations:
```javascript
const generatePlan = async () => {
  setLoading(true);
  try {
    const plan = await DietPlanService.generateDietPlan(data);
    setDietPlan(plan);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### 4. Use History for Form Changes
Add form changes to history for undo/redo functionality:
```javascript
const handleFormChange = (field, value) => {
  updateFormField(field, value);
  addToHistory(formData); // Save current state
};
```

## Migration from Local State

If you have components using local state that should be moved to the store:

### Before (Local State)
```javascript
const [patientData, setPatientData] = useState(null);
const [loading, setLoading] = useState(false);
```

### After (Store)
```javascript
import { usePatientData, useLoading, useActions } from './store/AppStore';

const patientData = usePatientData();
const loading = useLoading();
const { setPatientData, setLoading } = useActions();
```

## Performance Considerations

- The store uses React Context, which can cause re-renders when any part of the state changes
- Use selector hooks to minimize re-renders
- Consider splitting the store into multiple contexts if performance becomes an issue
- The history feature can consume memory for large applications

## Future Enhancements

Potential improvements to consider:
- Add middleware for logging actions
- Implement persistence to localStorage
- Add optimistic updates
- Create action creators for complex operations
- Add TypeScript support for better type safety
