import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  User, 
  Target, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Printer,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { usePatientData, usePhysiotherapySessions, useActions } from '../store/AppStore';

const FollowUpPhysiotherapy = () => {
  const patientData = usePatientData();
  const sessions = usePhysiotherapySessions();
  const { addPhysiotherapySession, updatePhysiotherapySession, deletePhysiotherapySession } = useActions();
  
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    therapist: '',
    type: 'General',
    duration: '30',
    exercises: '',
    progress: '',
    painLevel: '3',
    notes: '',
    status: 'Completed'
  });

  const sessionTypes = [
    'General',
    'Respiratory',
    'Pain Management',
    'Mobility',
    'Strength Training',
    'Balance',
    'Endurance',
    'Flexibility'
  ];

  const painLevels = [
    { value: '0', label: '0 - No Pain' },
    { value: '1', label: '1 - Very Mild' },
    { value: '2', label: '2 - Mild' },
    { value: '3', label: '3 - Moderate' },
    { value: '4', label: '4 - Moderate-Severe' },
    { value: '5', label: '5 - Severe' },
    { value: '6', label: '6 - Very Severe' },
    { value: '7', label: '7 - Intense' },
    { value: '8', label: '8 - Unbearable' },
    { value: '9', label: '9 - Excruciating' },
    { value: '10', label: '10 - Unimaginable' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const session = {
      id: editingSession ? editingSession.id : Date.now().toString(),
      ...formData,
      patientName: patientData?.patientName || 'Unknown Patient',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingSession) {
      updatePhysiotherapySession(session);
    } else {
      addPhysiotherapySession(session);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      therapist: '',
      type: 'General',
      duration: '30',
      exercises: '',
      progress: '',
      painLevel: '3',
      notes: '',
      status: 'Completed'
    });
    setShowForm(false);
    setEditingSession(null);
  };

  const handleEdit = (session) => {
    setFormData(session);
    setEditingSession(session);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deletePhysiotherapySession(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'Cancelled': return '#ef4444';
      case 'Rescheduled': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="status-icon" />;
      case 'Cancelled': return <AlertCircle className="status-icon" />;
      default: return <Clock className="status-icon" />;
    }
  };

  const getPainLevelColor = (level) => {
    const numLevel = parseInt(level);
    if (numLevel <= 3) return '#10b981';
    if (numLevel <= 6) return '#f59e0b';
    return '#ef4444';
  };

  const generateSampleSessions = () => {
    const sampleSessions = [
      {
        id: '1',
        date: '2025-10-15',
        time: '10:00',
        therapist: 'Sarah Wilson, PT',
        type: 'Respiratory',
        duration: '45',
        exercises: 'Deep breathing exercises, chest expansion, postural drainage, incentive spirometry',
        progress: 'Good improvement in chest expansion. Patient able to perform exercises independently.',
        painLevel: '2',
        notes: 'Patient responded well to breathing exercises. No shortness of breath during session.',
        status: 'Completed',
        patientName: patientData?.patientName || 'Mr. Rajesh Sharma',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        date: '2025-10-12',
        time: '14:00',
        therapist: 'Michael Brown, PT',
        type: 'Pain Management',
        duration: '30',
        exercises: 'Gentle stretching, heat therapy, positioning, relaxation techniques',
        progress: 'Pain reduced from 6/10 to 3/10. Patient reports better sleep quality.',
        painLevel: '3',
        notes: 'Heat therapy was very effective. Patient prefers morning sessions.',
        status: 'Completed',
        patientName: patientData?.patientName || 'Mr. Rajesh Sharma',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        date: '2025-10-10',
        time: '11:30',
        therapist: 'Emily Davis, PT',
        type: 'Mobility',
        duration: '40',
        exercises: 'Bed mobility, sitting balance, standing with support, walking with walker',
        progress: 'Improved bed mobility. Can sit independently for 10 minutes. Walking distance increased to 20 meters.',
        painLevel: '4',
        notes: 'Patient motivated and cooperative. Family education provided for home exercises.',
        status: 'Completed',
        patientName: patientData?.patientName || 'Mr. Rajesh Sharma',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    sampleSessions.forEach(session => {
      addPhysiotherapySession(session);
    });
  };

  const calculateProgress = () => {
    if (sessions.length < 2) return null;
    
    const recentSessions = sessions
      .filter(s => s.status === 'Completed')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
    
    if (recentSessions.length < 2) return null;
    
    const avgPainLevel = recentSessions.reduce((sum, s) => sum + parseInt(s.painLevel), 0) / recentSessions.length;
    const firstPainLevel = parseInt(recentSessions[recentSessions.length - 1].painLevel);
    const improvement = firstPainLevel - avgPainLevel;
    
    return {
      avgPainLevel: avgPainLevel.toFixed(1),
      improvement: improvement.toFixed(1),
      trend: improvement > 0 ? 'improving' : improvement < 0 ? 'declining' : 'stable'
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(sessions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${patientData?.patientName?.replace(/\s+/g, '_')}_Physiotherapy_Sessions.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const progress = calculateProgress();

  return (
    <div className="physiotherapy-container">
      <div className="physiotherapy-header">
        <div className="header-info">
          <h2>Follow-up Physiotherapy</h2>
          <p>Track physiotherapy sessions and patient progress</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus className="btn-icon" />
            Add Session
          </button>
          {sessions.length === 0 && (
            <button 
              onClick={generateSampleSessions}
              className="btn btn-secondary"
            >
              Generate Sample
            </button>
          )}
          {sessions.length > 0 && (
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

      {/* Progress Summary */}
      {progress && (
        <div className="progress-summary">
          <div className="progress-card">
            <TrendingUp className="progress-icon" />
            <div className="progress-info">
              <h4>Recent Progress</h4>
              <p>Average Pain Level: <strong>{progress.avgPainLevel}/10</strong></p>
              <p>Improvement: <strong>{progress.improvement > 0 ? '+' : ''}{progress.improvement}/10</strong></p>
              <p>Trend: <strong className={`trend-${progress.trend}`}>{progress.trend}</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* Session Form */}
      {showForm && (
        <div className="session-form-overlay">
          <div className="session-form">
            <div className="form-header">
              <h3>{editingSession ? 'Edit Session' : 'Add New Session'}</h3>
              <button onClick={resetForm} className="close-btn">×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Therapist</label>
                  <input
                    type="text"
                    name="therapist"
                    value={formData.therapist}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Therapist Name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Session Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    {sessionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="form-input"
                    min="15"
                    max="120"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Pain Level</label>
                  <select
                    name="painLevel"
                    value={formData.painLevel}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    {painLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Exercises Performed</label>
                <textarea
                  name="exercises"
                  value={formData.exercises}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="List of exercises and activities performed"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Progress Notes</label>
                <textarea
                  name="progress"
                  value={formData.progress}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="Patient progress and improvements observed"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="2"
                  placeholder="Additional observations or recommendations"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSession ? 'Update' : 'Add'} Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="sessions-content">
        {sessions.length === 0 ? (
          <div className="no-sessions">
            <Activity className="no-data-icon" />
            <h3>No Physiotherapy Sessions</h3>
            <p>Add physiotherapy sessions to track patient progress.</p>
          </div>
        ) : (
          <div className="sessions-list">
            {sessions
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(session => (
                <div key={session.id} className="session-card">
                  <div className="session-header">
                    <div className="session-date">
                      <Calendar className="date-icon" />
                      <div>
                        <span className="date">{new Date(session.date).toLocaleDateString()}</span>
                        <span className="time">{session.time}</span>
                      </div>
                    </div>
                    <div className="session-status" style={{ color: getStatusColor(session.status) }}>
                      {getStatusIcon(session.status)}
                      <span>{session.status}</span>
                    </div>
                  </div>
                  
                  <div className="session-details">
                    <div className="session-info">
                      <h4>{session.type} Session</h4>
                      <p><strong>Therapist:</strong> {session.therapist}</p>
                      <p><strong>Duration:</strong> {session.duration} minutes</p>
                      <p><strong>Pain Level:</strong> 
                        <span 
                          className="pain-level" 
                          style={{ color: getPainLevelColor(session.painLevel) }}
                        >
                          {session.painLevel}/10
                        </span>
                      </p>
                    </div>
                    
                    <div className="session-exercises">
                      <h5>Exercises Performed:</h5>
                      <p>{session.exercises}</p>
                    </div>
                    
                    <div className="session-progress">
                      <h5>Progress:</h5>
                      <p>{session.progress}</p>
                    </div>
                    
                    {session.notes && (
                      <div className="session-notes">
                        <h5>Notes:</h5>
                        <p>{session.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="session-actions">
                    <button 
                      onClick={() => handleEdit(session)}
                      className="btn btn-small btn-outline"
                    >
                      <Edit className="btn-icon" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(session.id)}
                      className="btn btn-small btn-danger"
                    >
                      <Trash2 className="btn-icon" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowUpPhysiotherapy;
