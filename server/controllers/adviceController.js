const db = require("../config/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAdvice = async (req, res) => {
  const { symptom, lat, lng, history } = req.body;

  if (!symptom) return res.status(400).json({ message: "No input provided" });

  const inputLower = symptom.toLowerCase().trim();
  const hospitalMap = `https://www.google.com/maps/search/hospital+near+me/@${lat || 0},${lng || 0},15z`;

  // 1. EMERGENCY TRIAGE (Local logic - stays fast)
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
          "🚨 EMERGENCY: High-risk symptoms detected. Please call 911/112 or proceed to the nearest hospital immediately. Do not wait.",
        hospital_link: hospitalMap,
      },
    ]);
  }

  try {
    // 2. DATABASE SEARCH (Local Records)
    const [dbResults] = await db.execute("SELECT * FROM health_advice");
    const matched = dbResults.filter((item) => {
      const keys = item.keywords
        .toLowerCase()
        .split(",")
        .map((k) => k.trim());
      return keys.some((k) => inputLower.includes(k) && k.length > 2);
    });

    if (matched.length > 0) {
      return res.json(
        matched.map((item) => ({
          severity: "found",
          advice_text: `[Verified Guidance]: ${item.advice_text}`,
          hospital_link: hospitalMap,
        })),
      );
    }

    // 3. AI ENGINE (Stable gemini-pro fallback)
    console.log("DB had no match. Contacting AI Brain (gemini-pro)...");

    // Using gemini-pro as it is the most stable and widely supported model ID
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Formatting History for Gemini Pro
    let cleanedHistory = [];
    if (history && Array.isArray(history)) {
      cleanedHistory = history
        .map((m) => ({
          role: m.sender === "bot" || m.role === "model" ? "model" : "user",
          parts: [{ text: m.text || "" }],
        }))
        .filter((m) => m.parts[0].text.length > 0);

      // Ensure history starts with user
      if (cleanedHistory.length > 0 && cleanedHistory[0].role === "model") {
        cleanedHistory.shift();
      }
    }

    const systemInstruction = `You are HealthSync AI, a professional medical assistant. 
    1. ONLY answer health, symptom, or medical-related questions. 
    2. For non-medical questions, politely state you are a health assistant and cannot answer. 
    3. Provide clear advice but NEVER a final diagnosis. 
    4. If symptoms sound concerning, advise booking a doctor. 
    5. User Query: `;

    const chat = model.startChat({ history: cleanedHistory });

    // We send the instructions as part of the first message to ensure compatibility
    const result = await chat.sendMessage(systemInstruction + symptom);
    const aiText = result.response.text();

    return res.json([
      {
        severity: "ai_generated",
        advice_text: aiText,
        hospital_link: hospitalMap,
      },
    ]);
  } catch (err) {
    console.error("AI SYSTEM ERROR LOG:", err.message);

    res.json([
      {
        severity: "unknown",
        advice_text:
          "I couldn't find a direct match. If you are feeling unwell, please use the 'Book Specialist' button below or click 'Nearest Hospital' for immediate care.",
        hospital_link: hospitalMap,
      },
    ]);
  }
};
