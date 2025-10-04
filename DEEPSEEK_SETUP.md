# DeepSeek AI Integration Setup

This app integrates DeepSeek via direct API calls using fetch. All AI calls live under `src/services/`.

## 1) No additional dependencies needed

The app uses native fetch API, so no additional packages are required.

## 2) Environment variables

Create a `.env.local` at the project root and add:

```
REACT_APP_DEEPSEEK_API_KEY=your_key_here
```

IMPORTANT: Never commit real keys to source control. For builds, prefix must be REACT_APP_.

The user also provided a sample key in chat. For safety, do NOT hardcode it in code. Use env vars instead.

## 3) Where the AI code lives

- `src/services/aiClient.js`
  - Uses fetch to call DeepSeek API directly
  - Enforces JSON-only responses and provides few-shot helpers
- `src/services/dietPlanService.js`
  - Calls DeepSeek to generate diet plans with strict schema
  - Keeps a commented local fallback generator
- `src/services/medicationCounsellingService.js`
  - Calls DeepSeek to generate counselling content, strict schema
  - Returns null on failure (UI handles fallback)
- `src/services/followUpService.js`
  - Suggests follow-up appointments and physiotherapy sessions

## 4) Prompt discipline

We use:
- A system message that instructs the model to return ONLY JSON matching a schema
- A user message with a concrete example JSON to shape structure
- `response_format: { type: 'json_object' }` when supported

## 5) Example outputs

### Diet Plan JSON example
```json
{
  "patientName": "Mr. Rajesh Sharma",
  "diagnosis": "Advanced Carcinoma Pancreas with Liver Metastases",
  "weight": "54",
  "age": "68",
  "gender": "Male",
  "comorbidities": "Type 2 Diabetes Mellitus (15 yrs), Hypertension (10 yrs), COPD",
  "medications": "1. Morphine 10mg BD\n2. Paracetamol 500mg SOS\n3. Amlodipine 5mg OD\n4. Metformin 500mg BD\n5. Salbutamol inhaler SOS",
  "plan": {
    "goals": ["Maintain adequate nutrition and hydration"],
    "dailyCalories": "1800-2200",
    "protein": "1.2-1.5g per kg body weight",
    "fluid": "2-2.5 liters daily",
    "meals": {
      "breakfast": { "time": "8:00 AM", "items": ["Steel-cut oats with berries", "Scrambled eggs", "Herbal tea"] },
      "midMorning": { "time": "10:30 AM", "items": ["Fruit smoothie with protein", "Almonds 10-15", "Coconut water"] },
      "lunch": { "time": "1:00 PM", "items": ["Soft rice with dal", "Steamed vegetables", "Grilled fish (small)", "Curd"] },
      "evening": { "time": "4:30 PM", "items": ["Green tea", "Dates 3-4", "Toast with butter"] },
      "dinner": { "time": "7:30 PM", "items": ["Khichdi with ghee", "Steamed vegetables", "Soup", "Warm milk with turmeric"] }
    },
    "restrictions": ["Avoid spicy/fried foods", "Limit sugar", "Limit sodium"],
    "supplements": ["Multivitamin", "Omega-3", "Probiotics"],
    "hydration": ["Water throughout the day", "Herbal teas", "Coconut water"],
    "specialConsiderations": ["Small frequent meals", "Soft easy-to-digest", "Monitor blood sugar"]
  }
}
```

### Medication Counselling JSON example
```json
{
  "patientName": "Mr. Rajesh Sharma",
  "generatedAt": "2025-10-03T10:00:00.000Z",
  "medications": [
    { "id": "1", "name": "Morphine 10mg", "dosage": "10mg", "frequency": "Twice daily" }
  ],
  "counselling": {
    "generalInstructions": ["Take at same time each day"],
    "specificInstructions": ["Morphine: take with food"],
    "lifestyleModifications": ["Stay hydrated"]
  },
  "importantNotes": ["Monitor pain and side effects"],
  "sideEffects": [
    { "medication": "Morphine", "commonSideEffects": ["Drowsiness"], "seriousSideEffects": ["Breathing problems"], "management": "Do not drive; seek help if severe" }
  ],
  "interactions": [
    { "medications": "Morphine + Alcohol", "interaction": "Increased sedation", "recommendation": "Avoid alcohol" }
  ],
  "storageInstructions": ["Keep in cool, dry place"],
  "emergencyContacts": [
    { "type": "Emergency", "contact": "108", "description": "Ambulance" }
  ]
}
```

## 6) Using the services

- Diet plan: `DietPlanService.generateDietPlan(patientData)`
- Medication counselling: `MedicationCounsellingService.generateCounselling(patientData)`
- Follow-up suggestions: `FollowUpAIService.suggestAppointments(patientData)` and `suggestPhysiotherapy(patientData)`

Each returns JSON matching the documented schema. The UI consumes these directly.
