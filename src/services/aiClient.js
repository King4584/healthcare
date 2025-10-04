// AI Client and Prompt Utilities
// All AI calls for DeepSeek should go through this module
// Now using Puter.js for free DeepSeek access - no API keys required!

// Check if Puter.js is available
const isPuterAvailable = () => {
  return typeof window !== 'undefined' && window.puter && window.puter.ai;
};

// Helper to enforce JSON responses
export const jsonSystemMessage = (schemaDescription) => ({
	role: 'system',
	content: `You are a clinical nutrition and palliative care assistant. Always respond ONLY as strict JSON matching this schema. Do not include prose before or after JSON. If data is missing, return nulls. Schema: ${schemaDescription}`
});

// Few-shot example helper
export const userWithExample = (instruction, exampleTitle, exampleJson) => [
	{ role: 'user', content: `${instruction}\n\nReturn ONLY JSON. Here is an example of the expected JSON structure titled: ${exampleTitle}.\nEXAMPLE_START\n${JSON.stringify(exampleJson, null, 2)}\nEXAMPLE_END` }
];

// Safe call wrapper using Puter.js for free DeepSeek access
export async function callDeepseekJSON({ messages, model = 'deepseek-chat', temperature = 0.2 }) {
	// Check if Puter.js is available
	if (!isPuterAvailable()) {
		console.warn('🔑 Puter.js not available. Make sure the script is loaded.');
		throw new Error('Puter.js not available. Make sure the script is loaded.');
	}
	
	console.log('🤖 Calling DeepSeek AI via Puter.js...', { model, temperature });

	try {
		// Convert messages to a single prompt for Puter.js
		const systemMessage = messages.find(m => m.role === 'system');
		const userMessage = messages.find(m => m.role === 'user');
		
		let prompt = '';
		if (systemMessage) {
			prompt += `${systemMessage.content}\n\n`;
		}
		if (userMessage) {
			prompt += userMessage.content;
		}

		console.log('📝 Sending prompt to Puter.js:', { promptLength: prompt.length });

		// Use Puter.js to call DeepSeek
		const response = await window.puter.ai.chat(prompt, {
			model: model,
			temperature: temperature
		});

		const content = response.message?.content || '{}';
		
		console.log('✅ Puter.js DeepSeek response received:', { 
			contentLength: content.length,
			hasJson: content.includes('{'),
			timestamp: new Date().toISOString()
		});
		
		try {
			const parsed = JSON.parse(content);
			console.log('🎯 AI Generated content successfully parsed');
			return parsed;
		} catch (e) {
			console.warn('⚠️ Failed to parse AI response as JSON, attempting extraction...');
			// If the model returned non-JSON, attempt to extract JSON
			const start = content.indexOf('{');
			const end = content.lastIndexOf('}');
			if (start !== -1 && end !== -1 && end > start) {
				const maybeJson = content.slice(start, end + 1);
				const parsed = JSON.parse(maybeJson);
				console.log('🔧 Successfully extracted JSON from AI response');
				return parsed;
			}
			throw new Error('Failed to parse DeepSeek JSON response');
		}
	} catch (error) {
		console.error('❌ Puter.js DeepSeek call failed:', error);
		throw new Error(`Puter.js DeepSeek error: ${error.message}`);
	}
}
