// client/src/services/aiService.js
import api from '../api';

// Triggers the backend to ask Gemini for clarifying questions
export const fetchClarifyingQuestions = async (prompt) => {
  try {
    const response = await api.post('/ai/questions', { prompt });
    return response.data; // Expecting array of questions
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch questions');
  }
};

// Triggers the backend to generate code for a specific file path
export const generateFileCode = async (prompt, answers, filePath) => {
  try {
    const response = await api.post('/ai/generate-code', {
      prompt,
      answers,
      filePath,
    });
    return response.data.code; // Expecting raw string code
  } catch (error) {
    throw new Error(error.response?.data?.message || `Failed to generate ${filePath}`);
  }
};