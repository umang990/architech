const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- INTERNAL HELPER FUNCTIONS ---

const generateFilePlanHelper = async (prompt, config, existingFiles = []) => {
  const configList = Object.entries(config || {})
      .map(([key, val]) => `- ${key}: ${val}`)
      .join('\n');

  const isUpdate = existingFiles.length > 0;

  let taskDescription = `Task: Create a file structure for a MERN application. Output a JSON array of strings (file paths).`;
  
  if (isUpdate) {
    taskDescription = `
      Task: Analyze the new requirements and the existing file structure.
      Goal: Return a JSON array of file paths that need to be CREATED or MODIFIED.
      Do NOT include files that do not need changes.
      
      Existing Files: ${existingFiles.map(f => f.path).join(', ')}
      New Requirements: "${prompt}"
      New Config: 
      ${configList}
    `;
  } else {
    taskDescription = `
      Task: Create a full file structure for a MERN (MongoDB, Express, React, Node) application.
      User Prompt: "${prompt}"
      Configuration: 
      ${configList}
    `;
  }

  const fullPrompt = `
    Role: Senior MERN Stack Architect.
    ${taskDescription}
    Output: Return ONLY a raw JSON array of file paths (strings). 
  `;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  const cleanJson = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
  
  try {
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("AI Plan Parse Error", e);
    return [];
  }
};

const generateFileContentHelper = async (filePath, prompt, config) => {
  const configList = Object.entries(config || {})
      .map(([key, val]) => `- ${key}: ${val}`)
      .join('\n');

  const fullPrompt = `
    Role: Senior Full Stack Developer.
    Task: Write the full code for the file: "${filePath}".
    Project Context: "${prompt}"
    Configuration:
    ${configList}
    Guidelines: Use modern ES6+, React Hooks, Mongoose. Return ONLY raw code.
  `;

  const result = await model.generateContent(fullPrompt);
  return result.response.text().replace(/^```\w*\n?/, "").replace(/\n?```$/, "").trim();
};

const generateChatResponseHelper = async (history, newMessage) => {
  const chatPrompt = `
    You are an AI assistant helping a user build a MERN app.
    User: ${newMessage}
    Answer helpful and concisely.
  `;
  const result = await model.generateContent(chatPrompt);
  return result.response.text();
}

// --- PUBLIC API HANDLERS ---

const generateQuestions = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

  try {
    const sysPrompt = `
      Role: Product Architect.
      Task: Analyze the request: "${prompt}" and generate a configuration schema.
      
      CRITICAL REQUIREMENT: The 'default' values in your schema MUST create a "Beautiful AI" style MVP using the MERN Stack (MongoDB, Express, React, Node).
      
      Default Settings MUST be:
      - Database: MongoDB
      - Backend: Express
      - Frontend: React
      - Styling: Tailwind CSS
      - Auth: Basic JWT (No complex OAuth by default)
      - Layout: Minimal, Clean
      
      Output: Return ONLY a raw JSON array of "Engineering Modules".
      
      JSON Structure per module:
      {
        "id": "string",
        "label": "string",
        "icon": "string (Lucide icon name)",
        "description": "string",
        "config": [{ "key": "string", "label": "string", "type": "select|toggle", "options": [], "default": "value" }]
      }
      
      Requirements: 
      1. Generate 5-7 tailored modules.
      2. Strict JSON.
    `;
    
    const result = await model.generateContent(sysPrompt);
    const cleanJson = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    res.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error('Gemini Schema Error:', error);
    res.json([]); 
  }
};

module.exports = { 
  generateQuestions, 
  generateFilePlanHelper, 
  generateFileContentHelper,
  generateChatResponseHelper
};