import { callDeepseekJSON, jsonSystemMessage, userWithExample } from './aiClient';

export class FollowUpAIService {
	static async suggestAppointments(patientData) {
		try {
			const schema = `{
				"appointments": Array<{ id: string, date: string, time: string, type: string, doctor: string, department: string, location: string, purpose: string, notes: string, status: string }>
			}`;
			const example = {
				appointments: [
					{ id: '1', date: '2025-10-17', time: '10:00', type: 'Follow-up', doctor: 'Dr. Sarah Johnson', department: 'Palliative Care', location: 'XYZ Multispeciality Hospital', purpose: 'Pain management review', notes: 'Bring medication diary', status: 'Scheduled' }
				]
			};
			const instruction = `Propose 2-3 follow-up appointments for the next 2-3 weeks for the patient based on diagnosis (${patientData.finalDiagnosis}) and comorbidities (${patientData.pastMedicalHistory}). Follow palliative care best practices. Return ONLY JSON.`;
			const messages = [ jsonSystemMessage(schema), ...userWithExample(instruction, 'follow-up-appointments-example', example) ];
			const json = await callDeepseekJSON({ messages });
			return json;
		} catch (e) {
			console.warn('DeepSeek appointment suggestions failed:', e?.message);
			return { appointments: [] };
		}
	}

	static async suggestPhysiotherapy(patientData) {
		try {
			const schema = `{
				"sessions": Array<{ id: string, date: string, time: string, therapist: string, type: string, duration: string, exercises: string, progress: string, painLevel: string, notes: string, status: string }>
			}`;
			const example = {
				sessions: [
					{ id: '1', date: '2025-10-15', time: '10:00', therapist: 'Sarah Wilson, PT', type: 'Respiratory', duration: '45', exercises: 'Deep breathing, chest expansion', progress: 'Improving endurance', painLevel: '2', notes: 'Tolerated well', status: 'Scheduled' }
				]
			};
			const instruction = `Suggest 2 physiotherapy sessions appropriate for palliative care with COPD and advanced cancer. Emphasize respiratory therapy, gentle mobility, pain management. Return ONLY JSON.`;
			const messages = [ jsonSystemMessage(schema), ...userWithExample(instruction, 'physiotherapy-sessions-example', example) ];
			const json = await callDeepseekJSON({ messages });
			return json;
		} catch (e) {
			console.warn('DeepSeek physiotherapy suggestions failed:', e?.message);
			return { sessions: [] };
		}
	}
}

export default FollowUpAIService;
