const db = require("../config/db");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAdvice = async (req, res) => {
  // Support both POST (req.body) and GET (req.query)
  const { symptom, lat, lng, history } = req.body.symptom
    ? req.body
    : req.query;

  if (!symptom) {
    return res.status(400).json({ message: "No input provided" });
  }

  const inputLower = symptom.toLowerCase().trim();
  const userLat = lat || "0";
  const userLng = lng || "0";
  const hospitalMap = `https://www.google.com/maps/search/hospital+near+me/@${userLat},${userLng},15z`;

  // 1. EMERGENCY TRIAGE (Safety Check)
  const dangerKeywords = [
    "chest pain",
    "breathing",
    "heavy bleeding",
    "unconscious",
    "stroke",
    "seizure",
    "suicidal",
    "heart attack",
    "difficulty breathing",
  ];
  if (dangerKeywords.some((key) => inputLower.includes(key))) {
    return res.json([
      {
        severity: "emergency",
        advice_text:
          "URGENT: Your symptoms indicate a high-risk situation. Please call 911 or your local emergency number immediately. Do not attempt to self-treat. Proceed to the nearest hospital now.",
        hospital_link: hospitalMap,
      },
    ]);
  }

  try {
    // 2. CHECK LOCAL DATABASE FIRST (Fuzzy matching for long strings)
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
          ...item,
          severity: "found",
          advice_text: `Verified Guidance: ${item.advice_text} (Note: If symptoms persist, please book a professional checkup.)`,
          hospital_link: hospitalMap,
        })),
      );
    }

    // 3. PREPARE AI ENGINE
    const systemPrompt = `
        ROLE: Professional AI Health Assistant for HealthSync.
        GUIDELINES:
        - Provide accurate, safe, and helpful health-related information.
        - If the user greets you (hi, hello, etc.), respond warmly and offer health assistance.
        - ALWAYS ask follow-up questions if symptoms are vague.
        - Give general advice and possible causes, NEVER a medical diagnosis.
        - Encourage seeking professional medical help if symptoms are concerning.
        - Do NOT prescribe medications or dosages.
        - Be calm, empathetic, and professional.
      `;

    // Format and Clean History (Gemini requires first message to be from 'user')
    let cleanedHistory = [];
    if (history && Array.isArray(history)) {
      cleanedHistory = history
        .map((item) => ({
          role:
            item.sender === "bot" || item.role === "model" ? "model" : "user",
          parts: Array.isArray(item.parts)
            ? item.parts
            : [{ text: item.text || "" }],
        }))
        .filter((item) => item.parts[0].text.length > 0);

      if (cleanedHistory.length > 0 && cleanedHistory[0].role === "model") {
        cleanedHistory.shift();
      }
    }

    // 4. AI EXECUTION WITH FALLBACK (Fixes the 404 Error)
    let botText = "";

    try {
      // Try the newer 'flash' model first
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt,
      });

      const chat = model.startChat({ history: cleanedHistory });
      const result = await chat.sendMessage(symptom);
      botText = result.response.text();
    } catch (innerErr) {
      console.warn("Flash model unavailable, falling back to Gemini-Pro...");

      // FALLBACK: Use the standard 'gemini-pro' model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // gemini-pro (v1) doesn't always support systemInstruction as a parameter,
      // so we include it in the prompt itself.
      const result = await model.generateContent(
        `${systemPrompt}\n\nUser Question: ${symptom}`,
      );
      botText = result.response.text();
    }

    return res.json([
      {
        severity: "ai_generated",
        advice_text: botText,
        hospital_link: hospitalMap,
      },
    ]);
  } catch (err) {
    console.error("AI SYSTEM ERROR:", err.message);
    res.json([
      {
        severity: "unknown",
        advice_text:
          "I am experiencing a slight delay in processing. If you feel unwell, please book a consultation with one of our specialists or visit the nearest hospital.",
        hospital_link: hospitalMap,
      },
    ]);
  }
};
