import { callDeepseekJSON, jsonSystemMessage, userWithExample } from './aiClient';

export class MedicationCounsellingService {
	static async generateCounselling(patientData) {
		try {
			const schema = `{
				"patientName": string,
				"generatedAt": string,
				"medications": Array<{ id: string, name: string, dosage: string, frequency: string }>,
				"counselling": {
					"generalInstructions": string[],
					"specificInstructions": string[],
					"lifestyleModifications": string[]
				},
				"importantNotes": string[],
				"sideEffects": Array<{ medication: string, commonSideEffects: string[], seriousSideEffects: string[], management: string }>,
				"interactions": Array<{ medications: string, interaction: string, recommendation: string }>,
				"storageInstructions": string[],
				"emergencyContacts": Array<{ type: string, contact: string, description: string }>
			}`;

			const example = {
				patientName: patientData.patientName,
				generatedAt: new Date().toISOString(),
				medications: [
					{ id: '1', name: 'Morphine 10mg', dosage: '10mg', frequency: 'Twice daily' }
				],
				counselling: {
					generalInstructions: ["Take at same time daily"],
					specificInstructions: ["Morphine: take with food"],
					lifestyleModifications: ["Stay hydrated"]
				},
				importantNotes: ["Monitor pain and side effects"],
				sideEffects: [
					{ medication: 'Morphine', commonSideEffects: ['Drowsiness'], seriousSideEffects: ['Breathing problems'], management: 'Do not drive; seek help if severe' }
				],
				interactions: [
					{ medications: 'Morphine + Alcohol', interaction: 'Increased sedation', recommendation: 'Avoid alcohol' }
				],
				storageInstructions: ["Keep in cool dry place"],
				emergencyContacts: [
					{ type: 'Emergency', contact: '108', description: 'Ambulance' }
				]
			};

			const medText = String(patientData.medicationsOnDischarge || '');
			const instruction = `Create medication counselling content for the patient with these medications (exact text list):\n${medText}\nComorbidities: ${patientData.pastMedicalHistory}\nDiagnosis: ${patientData.finalDiagnosis}\nSTRICT REQUIREMENTS:\n- Parse the list into name, dosage, frequency (use 'As prescribed' if unknown).\n- Provide safety counselling, side effects, interactions, storage, and emergency contacts.\n- Return ONLY JSON matching the schema.`;
			const messages = [ jsonSystemMessage(schema), ...userWithExample(instruction, 'medication-counselling-example', example) ];
			const json = await callDeepseekJSON({ messages });
			if (!json?.medications) throw new Error('Invalid AI response');
			return {
				...json,
				_aiGenerated: true,
				_generatedAt: new Date().toISOString(),
				_source: 'DeepSeek AI'
			};
		} catch (e) {
			console.warn('DeepSeek medication counselling failed, using fallback. Reason:', e?.message);
			// Fallback to UI component local generator (kept there). Here, return minimal stub.
			return null;
		}
	}
}

export default MedicationCounsellingService;
