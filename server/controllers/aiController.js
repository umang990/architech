const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using stable model for reliability
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// @desc    Generate Dynamic Dashboard Schema
// @route   POST /api/ai/questions
const generateQuestions = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

  try {
    const sysPrompt = `
      Role: Senior System Architect.
      Task: Analyze the project request: "${prompt}".
      Goal: Create a comprehensive technical configuration schema for a MERN stack application.
      
      Output: Return ONLY a raw JSON array of "Engineering Modules".
      
      JSON Structure per module:
      {
        "id": "string (unique kebab-case, e.g., 'auth', 'payments')",
        "label": "string (Display Name, e.g., 'Authentication')",
        "icon": "string (Icon Name, choose from: Shield, Database, Layout, Server, Globe, Terminal, Lock, Zap, Box, Activity, Users, Cloud, Smartphone, Code, CreditCard, MessageSquare, ShoppingCart, Video)",
        "description": "string (Short description of this section)",
        "config": [
          { 
            "key": "string (unique config key)", 
            "label": "string (Display Label)", 
            "type": "select" | "toggle" | "input" | "color", 
            "options": ["Option A", "Option B"] (Required ONLY if type is 'select'), 
            "default": "string or boolean or number (Initial value)" 
          }
        ]
      }

      Requirements:
      1. Generate 7-10 distinct modules tailored to the user's prompt (e.g., if E-commerce, include a 'Payments' module; if Social, include 'Realtime' or 'Media').
      2. Always include 'Core', 'Auth', 'Database', and 'UI' modules.
      3. Each module must have 5-10 specific configuration settings.
      4. Ensure 'default' values are sensible production recommendations.
      5. STRICT JSON ONLY. No markdown.
    `;
    
    const result = await model.generateContent(sysPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData;
    try {
        parsedData = JSON.parse(cleanJson);
    } catch (e) {
        console.error("JSON Parse Failed:", cleanJson);
        // Return empty array to handle gracefully on frontend
        return res.json([]);
    }

    if (!Array.isArray(parsedData)) {
        return res.json([]);
    }

    res.json(parsedData);

  } catch (error) {
    console.error('Gemini Schema Error:', error);
    res.json([]);
  }
};

// @desc    Generate file code based on Dashboard Config
// @route   POST /api/ai/generate-code
const generateCode = async (req, res) => {
  try {
    const { prompt, answers, filePath } = req.body;

    const configList = Object.entries(answers || {})
      .map(([key, val]) => `- ${key}: ${val}`)
      .join('\n');

    const fullPrompt = `
    Role: Senior MERN Stack Architect.
    Task: Write the full, production-ready code for the file: "${filePath}".
    
    Project Description:
    ${prompt}

    Technical Requirements & Configuration:
    ${configList}

    Guidelines:
    1. IMPORTS: Use specific libraries defined in the configuration.
    2. SYNTAX: Modern ES6+, Functional React Components, Mongoose Schemas.
    3. FORMAT: Return ONLY the raw code string. No markdown blocks (no \`\`\`).
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let code = response.text();

    code = code.replace(/^```\w*\n?/, "").replace(/\n?```$/, "").trim();

    res.json({ code });
  } catch (err) {
    console.error("Code Gen Error:", err);
    res.status(500).json({ message: "Code generation failed", error: err.message });
  }
};

module.exports = { generateQuestions, generateCode };