const db = require("../config/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini with the latest stable configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAdvice = async (req, res) => {
  // Support both body (POST) and query (GET)
  const { symptom, lat, lng, history } = req.body.symptom
    ? req.body
    : req.query;

  if (!symptom) return res.status(400).json({ message: "No input provided" });

  const inputLower = symptom.toLowerCase().trim();
  const hospitalMap = `https://www.google.com/maps/search/hospital+near+me/@${lat || 0},${lng || 0},15z`;

  // 1. EMERGENCY TRIAGE (Pre-AI safety check)
  const dangerKeywords = [
    "chest pain",
    "breathing",
    "heavy bleeding",
    "unconscious",
    "stroke",
    "seizure",
    "heart attack",
  ];
  if (dangerKeywords.some((key) => inputLower.includes(key))) {
    return res.json([
      {
        severity: "emergency",
        advice_text:
          "🚨 EMERGENCY: High-risk symptoms detected. Call 911/112 immediately or proceed to the nearest hospital. Do not wait.",
        hospital_link: hospitalMap,
      },
    ]);
  }

  try {
    // 2. DATABASE SEARCH (Primary Source)
    const [dbResults] = await db.execute("SELECT * FROM health_advice");
    const matched = dbResults.filter((item) => {
      const keys = item.keywords
        .toLowerCase()
        .split(",")
        .map((k) => k.trim());
      return keys.some((k) => inputLower.includes(k) && k.length > 2);
    });

    if (matched.length > 0) {
      console.log("Database match found.");
      return res.json(
        matched.map((item) => ({
          ...item,
          severity: "found",
          advice_text: `[Local Clinic Advice]: ${item.advice_text}`,
          hospital_link: hospitalMap,
        })),
      );
    }

    // 3. AI ENGINE (Gemini 1.5 Flash - The "Pro" way)
    console.log("No DB match. Searching the internet via HealthSync AI...");

    // We use gemini-1.5-flash as it is the most stable and available model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Clean and validate history
    let chatHistory = [];
    if (history && Array.isArray(history)) {
      chatHistory = history
        .map((m) => ({
          role: m.sender === "bot" || m.role === "model" ? "model" : "user",
          parts: [{ text: m.text || "" }],
        }))
        .filter((m) => m.parts[0].text.length > 0);

      // Gemini rule: History must start with 'user'
      if (chatHistory.length > 0 && chatHistory[0].role === "model") {
        chatHistory.shift();
      }
    }

    const systemPrompt = `
      You are HealthSync AI, a professional medical assistant. 
      - ONLY discuss health, symptoms, nutrition, and wellness.
      - If the user greets you, reply warmly.
      - Provide clear, medically responsible advice based on global health standards.
      - NEVER give a final diagnosis or prescriptions.
      - ALWAYS advise booking a professional if symptoms are persistent.
      - User Query: ${symptom}
    `;

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(systemPrompt);
    const botText = result.response.text();

    return res.json([
      {
        severity: "ai_generated",
        advice_text: botText,
        hospital_link: hospitalMap,
      },
    ]);
  } catch (err) {
    console.error("PRO AI SYSTEM ERROR:", err.message);

    // Final Safe Fallback
    res.json([
      {
        severity: "unknown",
        advice_text:
          "I couldn't find an immediate match. For your safety, please book a consultation with one of our specialists or click 'Nearest Hospital' below.",
        hospital_link: hospitalMap,
      },
    ]);
  }
};
