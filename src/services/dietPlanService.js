// Diet Plan Generation Service
import { callDeepseekJSON, jsonSystemMessage, userWithExample } from './aiClient';

export class DietPlanService {
  static async generateDietPlan(patientData) {
    // Try DeepSeek first
    try {
      const schemaDescription = `{
        "patientName": string,
        "diagnosis": string,
        "weight": string | number,
        "age": string | number,
        "gender": string,
        "comorbidities": string,
        "medications": string,
        "plan": {
          "goals": string[],
          "dailyCalories": string,
          "protein": string,
          "fluid": string,
          "meals": {
            "breakfast": { "time": string, "items": string[] },
            "midMorning": { "time": string, "items": string[] },
            "lunch": { "time": string, "items": string[] },
            "evening": { "time": string, "items": string[] },
            "dinner": { "time": string, "items": string[] }
          },
          "restrictions": string[],
          "supplements": string[],
          "hydration": string[],
          "specialConsiderations": string[]
        }
      }`;

      const example = {
        patientName: patientData.patientName,
        diagnosis: patientData.finalDiagnosis,
        weight: String(patientData.weightAtDischarge || ''),
        age: String(patientData.age || ''),
        gender: String(patientData.gender || ''),
        comorbidities: String(patientData.pastMedicalHistory || ''),
        medications: String(patientData.medicationsOnDischarge || ''),
        plan: {
          goals: [
            "Maintain adequate nutrition and hydration",
            "Support immune function",
            "Manage symptoms and side effects",
            "Improve quality of life",
            "Prevent malnutrition and weight loss"
          ],
          dailyCalories: "1800-2200",
          protein: "1.2-1.5g per kg body weight",
          fluid: "2-2.5 liters daily",
          meals: {
            breakfast: { time: "8:00 AM", items: ["Steel-cut oats with berries", "Scrambled eggs", "Herbal tea"] },
            midMorning: { time: "10:30 AM", items: ["Fruit smoothie with protein", "Almonds 10-15", "Coconut water"] },
            lunch: { time: "1:00 PM", items: ["Soft rice with dal", "Steamed vegetables", "Grilled fish (small)", "Curd"] },
            evening: { time: "4:30 PM", items: ["Green tea", "Dates 3-4", "Toast with butter"] },
            dinner: { time: "7:30 PM", items: ["Khichdi with ghee", "Steamed vegetables", "Soup", "Warm milk with turmeric"] }
          },
          restrictions: ["Avoid spicy/fried foods", "Limit sugar", "Limit sodium"],
          supplements: ["Multivitamin", "Omega-3", "Probiotics"],
          hydration: ["Water throughout the day", "Herbal teas", "Coconut water"],
          specialConsiderations: ["Small frequent meals", "Soft easy-to-digest", "Monitor blood sugar"]
        }
      };

      const instruction = `Create a diet plan for a palliative care patient with advanced pancreatic cancer.
STRICT REQUIREMENTS:
- Consider comorbidities: ${patientData.pastMedicalHistory}
- Weight (kg): ${patientData.weightAtDischarge}
- Age/Gender: ${patientData.age} / ${patientData.gender}
- Diagnosis: ${patientData.finalDiagnosis}
- Medications: ${patientData.medicationsOnDischarge}
- Prefer small, frequent, soft, easy-to-digest, calorie-dense foods.
- Respect diabetes (low GI), hypertension (low sodium), COPD (avoid bloating) if present.
Return ONLY JSON matching the schema.`;

      const messages = [
        jsonSystemMessage(schemaDescription),
        ...userWithExample(instruction, 'diet-plan-example', example)
      ];

      const json = await callDeepseekJSON({ messages });
      // Minimal validation
      if (!json?.plan?.meals) throw new Error('Invalid AI response');
      
      // Add AI indicator to the response
      return {
        ...json,
        _aiGenerated: true,
        _generatedAt: new Date().toISOString(),
        _source: 'DeepSeek AI'
      };
    } catch (aiError) {
      console.warn('⚠️ DeepSeek diet plan failed, using fallback. Reason:', aiError?.message);
      console.log('📋 Using hardcoded fallback generator');
      // Fallback to existing hardcoded generator
      // return this.hardcodedDietPlan(patientData);
      const dietPlan = {
        patientName: patientData.patientName,
        diagnosis: patientData.finalDiagnosis,
        weight: patientData.weightAtDischarge,
        age: patientData.age,
        gender: patientData.gender,
        comorbidities: patientData.pastMedicalHistory,
        medications: patientData.medicationsOnDischarge,
        plan: this.generatePersonalizedPlan(patientData),
        _aiGenerated: false,
        _generatedAt: new Date().toISOString(),
        _source: 'Hardcoded Fallback'
      };
      return dietPlan;
    }
  }

  static generatePersonalizedPlan(data) {
    const { finalDiagnosis, weightAtDischarge, age, pastMedicalHistory, medicationsOnDischarge } = data;
    
    // Base plan for pancreatic cancer with palliative care
    const basePlan = {
      goals: [
        "Maintain adequate nutrition and hydration",
        "Support immune function",
        "Manage symptoms and side effects",
        "Improve quality of life",
        "Prevent malnutrition and weight loss"
      ],
      dailyCalories: weightAtDischarge < 60 ? "1800-2200" : "2000-2400",
      protein: "1.2-1.5g per kg body weight",
      fluid: "2-2.5 liters daily",
      meals: {
        breakfast: {
          time: "8:00 AM",
          items: [
            "Oatmeal with banana and honey (easy to digest)",
            "Soft boiled egg or scrambled eggs",
            "Herbal tea or warm water with lemon",
            "Supplements: Vitamin D3, B-complex"
          ]
        },
        midMorning: {
          time: "10:30 AM",
          items: [
            "Fresh fruit smoothie with protein powder",
            "Nuts (almonds, walnuts) - 10-15 pieces",
            "Coconut water or fresh juice"
          ]
        },
        lunch: {
          time: "1:00 PM",
          items: [
            "Soft rice with dal (lentils) - well cooked",
            "Steamed vegetables (carrots, spinach, pumpkin)",
            "Grilled fish or chicken (small portions)",
            "Curd or yogurt",
            "Herbal tea"
          ]
        },
        evening: {
          time: "4:30 PM",
          items: [
            "Green tea with ginger",
            "Dry fruits (dates, figs) - 3-4 pieces",
            "Crackers or toast with butter"
          ]
        },
        dinner: {
          time: "7:30 PM",
          items: [
            "Khichdi (rice and dal) with ghee",
            "Steamed vegetables",
            "Soup (vegetable or chicken)",
            "Warm milk with turmeric before bed"
          ]
        }
      },
      restrictions: [
        "Avoid spicy, fried, and processed foods",
        "Limit sugar intake (diabetes management)",
        "Avoid alcohol and smoking",
        "Limit sodium intake (hypertension)",
        "Avoid raw vegetables and fruits with skin"
      ],
      supplements: [
        "Multivitamin daily",
        "Omega-3 fatty acids",
        "Probiotics for gut health",
        "Vitamin C for immune support",
        "Protein powder if needed"
      ],
      hydration: [
        "Drink water throughout the day",
        "Herbal teas (ginger, chamomile)",
        "Coconut water for electrolytes",
        "Fresh fruit juices (diluted)",
        "Avoid caffeinated beverages"
      ],
      specialConsiderations: [
        "Small, frequent meals (6-8 times daily)",
        "Soft, easy-to-digest foods",
        "High-calorie, nutrient-dense options",
        "Monitor blood sugar levels regularly",
        "Consult with oncologist before major changes"
      ]
    };

    // Customize based on specific conditions
    if (pastMedicalHistory.includes("Diabetes")) {
      basePlan.restrictions.push("Monitor carbohydrate intake carefully");
      basePlan.meals.breakfast.items[0] = "Steel-cut oats with berries (low glycemic)";
    }

    if (pastMedicalHistory.includes("COPD")) {
      basePlan.specialConsiderations.push("Avoid foods that cause gas or bloating");
      basePlan.meals.dinner.items.push("Avoid large meals that may cause breathlessness");
    }

    return basePlan;
  }

  // Method to save diet plan to localStorage
  static saveDietPlanToStorage(dietPlan) {
    try {
      const savedPlans = this.getSavedDietPlans();
      const planWithId = {
        ...dietPlan,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      savedPlans.push(planWithId);
      localStorage.setItem('savedDietPlans', JSON.stringify(savedPlans));
      return planWithId;
    } catch (error) {
      console.error('Error saving diet plan:', error);
      return null;
    }
  }

  // Method to get saved diet plans from localStorage
  static getSavedDietPlans() {
    try {
      const saved = localStorage.getItem('savedDietPlans');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error retrieving saved diet plans:', error);
      return [];
    }
  }

  // Method to delete a saved diet plan
  static deleteDietPlan(id) {
    try {
      const savedPlans = this.getSavedDietPlans();
      const filteredPlans = savedPlans.filter(plan => plan.id !== id);
      localStorage.setItem('savedDietPlans', JSON.stringify(filteredPlans));
      return true;
    } catch (error) {
      console.error('Error deleting diet plan:', error);
      return false;
    }
  }

  // Method to export diet plan as JSON
  static exportDietPlan(dietPlan) {
    const dataStr = JSON.stringify(dietPlan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${dietPlan.patientName.replace(/\s+/g, '_')}_Diet_Plan.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
