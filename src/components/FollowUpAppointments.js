import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Download,
  Printer
} from 'lucide-react';
import { usePatientData, useFollowUpAppointments, useActions } from '../store/AppStore';

const FollowUpAppointments = () => {
  const patientData = usePatientData();
  const appointments = useFollowUpAppointments();
  const { addFollowUpAppointment, updateFollowUpAppointment, deleteFollowUpAppointment } = useActions();
  
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'Follow-up',
    doctor: '',
    department: 'Palliative Care',
    location: 'XYZ Multispeciality Hospital',
    purpose: '',
    notes: '',
    status: 'Scheduled'
  });

  const appointmentTypes = [
    'Follow-up',
    'Consultation',
    'Review',
    'Emergency',
    'Procedure',
    'Therapy Session'
  ];

  const departments = [
    'Palliative Care',
    'Oncology',
    'Internal Medicine',
    'Cardiology',
    'Endocrinology',
    'Pulmonology',
    'Physiotherapy'
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
    
    const appointment = {
      id: editingAppointment ? editingAppointment.id : Date.now().toString(),
      ...formData,
      patientName: patientData?.patientName || 'Unknown Patient',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingAppointment) {
      updateFollowUpAppointment(appointment);
    } else {
      addFollowUpAppointment(appointment);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      type: 'Follow-up',
      doctor: '',
      department: 'Palliative Care',
      location: 'XYZ Multispeciality Hospital',
      purpose: '',
      notes: '',
      status: 'Scheduled'
    });
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handleEdit = (appointment) => {
    setFormData(appointment);
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteFollowUpAppointment(id);
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

  const generateSampleAppointments = () => {
    const sampleAppointments = [
      {
        id: '1',
        date: '2025-10-17',
        time: '10:00',
        type: 'Follow-up',
        doctor: 'Dr. Sarah Johnson',
        department: 'Palliative Care',
        location: 'XYZ Multispeciality Hospital',
        purpose: 'Pain management review and medication adjustment',
        notes: 'Patient to bring medication diary and pain assessment',
        status: 'Scheduled',
        patientName: patientData?.patientName || 'Mr. Rajesh Sharma',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        date: '2025-10-24',
        time: '14:30',
        type: 'Consultation',
        doctor: 'Dr. Michael Chen',
        department: 'Oncology',
        location: 'XYZ Multispeciality Hospital',
        purpose: 'Cancer progression assessment and treatment options',
        notes: 'CT scan results review',
        status: 'Scheduled',
        patientName: patientData?.patientName || 'Mr. Rajesh Sharma',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        date: '2025-10-20',
        time: '09:00',
        type: 'Review',
        doctor: 'Dr. Emily Rodriguez',
        department: 'Endocrinology',
        location: 'XYZ Multispeciality Hospital',
        purpose: 'Diabetes management and blood sugar monitoring',
        notes: 'HbA1c test results review',
        status: 'Scheduled',
        patientName: patientData?.patientName || 'Mr. Rajesh Sharma',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    sampleAppointments.forEach(appointment => {
      addFollowUpAppointment(appointment);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(appointments, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${patientData?.patientName?.replace(/\s+/g, '_')}_Follow_Up_Appointments.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="follow-up-appointments-container">
      <div className="appointments-header">
        <div className="header-info">
          <h2>Follow-up Appointments</h2>
          <p>Manage patient follow-up appointments and consultations</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus className="btn-icon" />
            Add Appointment
          </button>
          {appointments.length === 0 && (
            <button 
              onClick={generateSampleAppointments}
              className="btn btn-secondary"
            >
              Generate Sample
            </button>
          )}
          {appointments.length > 0 && (
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

      {/* Appointment Form */}
      {showForm && (
        <div className="appointment-form-overlay">
          <div className="appointment-form">
            <div className="form-header">
              <h3>{editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}</h3>
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
                  <label className="form-label">Appointment Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    {appointmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Doctor</label>
                  <input
                    type="text"
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Dr. Name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
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
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rescheduled">Rescheduled</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Purpose</label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="Purpose of the appointment"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="3"
                  placeholder="Additional notes or instructions"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAppointment ? 'Update' : 'Add'} Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="appointments-content">
        {appointments.length === 0 ? (
          <div className="no-appointments">
            <Calendar className="no-data-icon" />
            <h3>No Appointments Scheduled</h3>
            <p>Add follow-up appointments to track patient care.</p>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments
              .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
              .map(appointment => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="appointment-date">
                      <Calendar className="date-icon" />
                      <div>
                        <span className="date">{new Date(appointment.date).toLocaleDateString()}</span>
                        <span className="time">{appointment.time}</span>
                      </div>
                    </div>
                    <div className="appointment-status" style={{ color: getStatusColor(appointment.status) }}>
                      {getStatusIcon(appointment.status)}
                      <span>{appointment.status}</span>
                    </div>
                  </div>
                  
                  <div className="appointment-details">
                    <div className="appointment-info">
                      <h4>{appointment.type}</h4>
                      <p><strong>Doctor:</strong> {appointment.doctor}</p>
                      <p><strong>Department:</strong> {appointment.department}</p>
                      <p><strong>Purpose:</strong> {appointment.purpose}</p>
                      {appointment.notes && (
                        <p><strong>Notes:</strong> {appointment.notes}</p>
                      )}
                    </div>
                    
                    <div className="appointment-location">
                      <MapPin className="location-icon" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>
                  
                  <div className="appointment-actions">
                    <button 
                      onClick={() => handleEdit(appointment)}
                      className="btn btn-small btn-outline"
                    >
                      <Edit className="btn-icon" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(appointment.id)}
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

export default FollowUpAppointments;
