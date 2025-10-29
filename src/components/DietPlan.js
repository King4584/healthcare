import React from 'react';
import { 
  Target, 
  Clock, 
  Utensils, 
  AlertTriangle, 
  Pill, 
  Droplets, 
  Heart,
  Download,
  Printer,
  Mail
} from 'lucide-react';
import { sendDietPlanEmail } from '../services/emailService';

const DietPlan = ({ dietPlan }) => {
  const { patientName, diagnosis, weight, age, gender, comorbidities, medications, plan, _aiGenerated, _source, _generatedAt } = dietPlan;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([document.getElementById('diet-plan-content').innerHTML], {
      type: 'text/html'
    });
    element.href = URL.createObjectURL(file);
    element.download = `${patientName.replace(/\s+/g, '_')}_Diet_Plan.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleEmail = async () => {
    try {
      const email = prompt('Please enter the patient\'s email address:');
      if (!email) return;

      const contentElement = document.getElementById('diet-plan-content');
      const content = contentElement.cloneNode(true); // Clone to avoid style issues
      const response = await sendDietPlanEmail(email, content, patientName);
      if (response.ok) {
        alert('Diet plan sent successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Failed to send email: ${error.message}`);
    }
  };

  return (
    <div id="diet-plan-content" className="diet-plan-container">
      <div className="diet-plan-header">
        <div className="header-info">
          <h2>Personalized Diet Plan</h2>
          <div className="patient-info">
            <h3>{patientName}</h3>
            <p>{age} years, {gender} • Weight: {weight} kg</p>
            <p className="diagnosis">{diagnosis}</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="source-indicator">
            <span className={`source-badge ${_aiGenerated ? 'ai-generated' : 'fallback'}`}>
              {_aiGenerated ? '🤖 AI Generated' : '📋 Hardcoded'}
            </span>
            <span className="source-details">
              {_source} • {new Date(_generatedAt).toLocaleTimeString()}
            </span>
          </div>
          <button onClick={handlePrint} className="btn btn-outline">
            <Printer className="btn-icon" />
            Print
          </button>
          <button onClick={handleDownload} className="btn btn-outline">
            <Download className="btn-icon" />
            Download
          </button>
          <button onClick={handleEmail} className="btn btn-outline">
            <Mail className="btn-icon" />
            Email PDF
          </button>
        </div>
      </div>

      <div className="diet-plan-content">
        {/* Goals Section */}
        <div className="diet-section">
          <div className="section-header">
            <Target className="section-icon" />
            <h3>Nutrition Goals</h3>
          </div>
          <div className="goals-grid">
            {plan.goals.map((goal, index) => (
              <div key={index} className="goal-item">
                <Heart className="goal-icon" />
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nutritional Requirements */}
        <div className="diet-section">
          <div className="section-header">
            <Target className="section-icon" />
            <h3>Daily Nutritional Requirements</h3>
          </div>
          <div className="nutrition-grid">
            <div className="nutrition-item">
              <strong>Calories:</strong> {plan.dailyCalories} kcal
            </div>
            <div className="nutrition-item">
              <strong>Protein:</strong> {plan.protein}
            </div>
            <div className="nutrition-item">
              <strong>Fluids:</strong> {plan.fluid}
            </div>
          </div>
        </div>

        {/* Meal Plan */}
        <div className="diet-section">
          <div className="section-header">
            <Utensils className="section-icon" />
            <h3>Daily Meal Plan</h3>
          </div>
          <div className="meals-container">
            {Object.entries(plan.meals).map(([mealName, mealData]) => (
              <div key={mealName} className="meal-card">
                <div className="meal-header">
                  <Clock className="meal-icon" />
                  <h4>{mealName.charAt(0).toUpperCase() + mealName.slice(1)}</h4>
                  <span className="meal-time">{mealData.time}</span>
                </div>
                <div className="meal-items">
                  {mealData.items.map((item, index) => (
                    <div key={index} className="meal-item">
                      <span className="item-bullet">•</span>
                      <span contentEditable>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restrictions */}
        <div className="diet-section">
          <div className="section-header">
            <AlertTriangle className="section-icon" />
            <h3>Food Restrictions & Avoidances</h3>
          </div>
          <div className="restrictions-list">
            {plan.restrictions.map((restriction, index) => (
              <div key={index} className="restriction-item">
                <AlertTriangle className="restriction-icon" />
                <span>{restriction}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Supplements */}
        <div className="diet-section">
          <div className="section-header">
            <Pill className="section-icon" />
            <h3>Recommended Supplements</h3>
          </div>
          <div className="supplements-grid">
            {plan.supplements.map((supplement, index) => (
              <div key={index} className="supplement-item">
                <Pill className="supplement-icon" />
                <span>{supplement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hydration */}
        <div className="diet-section">
          <div className="section-header">
            <Droplets className="section-icon" />
            <h3>Hydration Guidelines</h3>
          </div>
          <div className="hydration-list">
            {plan.hydration.map((item, index) => (
              <div key={index} className="hydration-item">
                <Droplets className="hydration-icon" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Special Considerations */}
        <div className="diet-section">
          <div className="section-header">
            <Heart className="section-icon" />
            <h3>Special Considerations</h3>
          </div>
          <div className="considerations-list">
            {plan.specialConsiderations.map((consideration, index) => (
              <div key={index} className="consideration-item">
                <Heart className="consideration-icon" />
                <span>{consideration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Context */}
        <div className="diet-section medical-context">
          <div className="section-header">
            <Heart className="section-icon" />
            <h3>Medical Context</h3>
          </div>
          <div className="medical-info">
            <div className="medical-item">
              <strong>Comorbidities:</strong> {comorbidities}
            </div>
            <div className="medical-item">
              <strong>Current Medications:</strong>
              <div className="medications-list">
                {medications.split('\n').map((med, index) => (
                  <div key={index} className="medication-item">
                    {med.trim()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer">
          <AlertTriangle className="disclaimer-icon" />
          <div>
            <strong>Important Disclaimer:</strong>
            <p>
              This diet plan is generated based on the provided medical information and should be used as a general guideline. 
              Please consult with your healthcare provider, nutritionist, or oncologist before making any significant dietary changes. 
              Individual needs may vary, and this plan should be adjusted based on your specific medical condition and treatment plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlan;
