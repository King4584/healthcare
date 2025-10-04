# HealthCare Diet Planner

A beautiful, AI-powered web application that generates personalized diet plans based on patient medical data. This React application provides healthcare professionals with an intuitive interface to input patient information and receive comprehensive, medically-informed nutrition recommendations.

## Features

- **Patient Data Input Form**: Comprehensive form for entering patient medical information
- **AI-Powered Diet Generation**: Intelligent diet plan creation based on medical conditions
- **Beautiful UI**: Modern, responsive design with gradient backgrounds and smooth animations
- **Print & Download**: Export diet plans for patient records
- **Medical Context Awareness**: Considers comorbidities, medications, and specific conditions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Sample Patient Data

The application comes pre-filled with sample data for Mr. Rajesh Sharma, a 68-year-old male with advanced pancreatic cancer. This demonstrates how the system handles complex medical cases with multiple comorbidities.

## Technology Stack

- **Frontend**: React 18
- **Styling**: CSS3 with modern features (Grid, Flexbox, Gradients)
- **Icons**: Lucide React
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd healthcare
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and visit `http://localhost:3000`

## How to Use

1. **Input Patient Data**: Fill out the comprehensive patient information form with medical details
2. **Generate Diet Plan**: Click "Generate Diet Plan" to create a personalized nutrition plan
3. **Review Results**: View the detailed diet plan with meal schedules, restrictions, and recommendations
4. **Export**: Print or download the diet plan for patient records

## Diet Plan Features

The generated diet plans include:

- **Nutrition Goals**: Specific objectives based on patient condition
- **Daily Requirements**: Calorie, protein, and fluid recommendations
- **Meal Schedule**: Detailed 5-meal daily plan with specific foods
- **Food Restrictions**: Items to avoid based on medical conditions
- **Supplements**: Recommended nutritional supplements
- **Hydration Guidelines**: Fluid intake recommendations
- **Special Considerations**: Condition-specific dietary advice
- **Medical Context**: Integration with patient's medications and comorbidities

## AI Integration

Currently, the application uses a sophisticated algorithm to generate diet plans based on medical data. In a production environment, this would integrate with:

- OpenAI GPT models
- Medical nutrition databases
- Clinical guidelines APIs
- Healthcare provider systems

## Customization

The application is designed to be easily customizable:

- Modify the diet generation algorithm in `src/App.js`
- Update styling in `src/index.css` and `src/App.css`
- Add new form fields in `src/components/PatientForm.js`
- Enhance diet plan display in `src/components/DietPlan.js`

## Sample Use Cases

- **Oncology Patients**: Palliative care nutrition support
- **Diabetes Management**: Blood sugar control through diet
- **Cardiovascular Health**: Heart-healthy meal planning
- **Geriatric Care**: Age-appropriate nutrition recommendations
- **Post-Surgical Recovery**: Healing-focused nutrition plans

## Future Enhancements

- Integration with real AI APIs (OpenAI, Claude)
- Patient data persistence
- Multi-language support
- Advanced medical condition handling
- Integration with hospital systems
- Mobile app version

## Contributing

This is a demonstration project showcasing modern React development practices and healthcare application design. Feel free to use it as a starting point for your own healthcare applications.

## License

This project is for educational and demonstration purposes. Please ensure compliance with healthcare data regulations (HIPAA, GDPR) when handling real patient data.

---

**Note**: This application is for demonstration purposes. Always consult with qualified healthcare professionals for actual medical advice and treatment plans.
