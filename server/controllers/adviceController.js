const db = require("../config/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAdvice = async (req, res) => {
  // Support both POST and GET
  const { symptom, lat, lng, history } = req.body.symptom
    ? req.body
    : req.query;

  if (!symptom) return res.status(400).json({ message: "No input provided" });

  const inputLower = symptom.toLowerCase().trim();
  const hospitalMap = `https://www.google.com/maps/search/hospital+near+me/@${lat || 0},${lng || 0},15z`;

  // 1. EMERGENCY TRIAGE (Always check first)
  const dangerKeywords = [
    "chest pain",
    "breathing",
    "heavy bleeding",
    "unconscious",
    "stroke",
    "seizure",
    "suicidal",
    "heart attack",
  ];
  if (dangerKeywords.some((key) => inputLower.includes(key))) {
    return res.json([
      {
        severity: "emergency",
        advice_text:
          "URGENT: This sounds like a medical emergency. Please call 911 or your local emergency number immediately and proceed to the nearest hospital.",
        hospital_link: hospitalMap,
      },
    ]);
  }

  try {
    // 2. DATABASE SEARCH (Your custom knowledge)
    const [dbResults] = await db.execute("SELECT * FROM health_advice");
    const matched = dbResults.filter((item) => {
      const keys = item.keywords
        .toLowerCase()
        .split(",")
        .map((k) => k.trim());
      return keys.some((k) => inputLower.includes(k) && k.length > 2);
    });

    // If we find a match in your DB, we prioritize that
    if (matched.length > 0) {
      return res.json(
        matched.map((item) => ({
          ...item,
          severity: "found",
          advice_text: `[Verified Guidance]: ${item.advice_text}`,
          hospital_link: hospitalMap,
        })),
      );
    }

    // 3. AI FALLBACK (Google Gemini) - Broad Medical Knowledge
    // We only reach this if the database has NO match
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `
        You are HealthSync AI, a specialized medical assistant.
        
        STRICT RULES:
        1. ONLY answer questions related to health, symptoms, nutrition, fitness, mental health, and wellness.
        2. If a user asks a non-medical question (e.g., politics, sports, entertainment, general trivia), politely reply: "I am a dedicated medical assistant and can only help with health-related concerns."
        3. Never provide a final diagnosis or prescriptions.
        4. If symptoms sound serious, advise them to book a doctor using the 'Book Specialist' button.
        5. Provide clear, empathetic, and professional advice.
      `,
    });

    // Clean history (Ensuring it starts with 'user')
    let cleanedHistory = (history || [])
      .map((item) => ({
        role: item.sender === "bot" || item.role === "model" ? "model" : "user",
        parts: [{ text: item.text || "" }],
      }))
      .filter((item) => item.parts[0].text.length > 0);

    if (cleanedHistory.length > 0 && cleanedHistory[0].role === "model") {
      cleanedHistory.shift();
    }

    const chat = model.startChat({ history: cleanedHistory });
    const result = await chat.sendMessage(symptom);
    const aiText = result.response.text();

    return res.json([
      {
        severity: "ai_generated",
        advice_text: aiText,
        hospital_link: hospitalMap,
      },
    ]);
  } catch (err) {
    console.error("AI SYSTEM ERROR:", err.message);
    res.json([
      {
        severity: "unknown",
        advice_text:
          "I couldn't find a direct match. To be safe, please book a consultation with one of our specialists or click 'Nearest Hospital' below.",
        hospital_link: hospitalMap,
      },
    ]);
  }
};
