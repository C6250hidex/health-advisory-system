const db = require("../config/db");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAdvice = async (req, res) => {
  // Support both POST (req.body) and GET (req.query) for maximum flexibility
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

  // 1. EMERGENCY TRIAGE (Safety Check - Highest Priority)
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
          "🚨 URGENT: Your symptoms indicate a high-risk medical emergency. Please CALL 911 or your local emergency number immediately. Do not attempt to self-treat. Proceed to the nearest hospital without delay.",
        hospital_link: hospitalMap,
      },
    ]);
  }

  try {
    // 2. MULTI-MATCH DATABASE SEARCH (Keyword Extraction from long strings)
    const [dbResults] = await db.execute("SELECT * FROM health_advice");

    const matchedResults = dbResults.filter((row) => {
      const dbKeywords = row.keywords
        .toLowerCase()
        .split(",")
        .map((k) => k.trim());
      // Match if any specific keyword in this DB row exists anywhere in the user's long string
      return dbKeywords.some(
        (keyword) => inputLower.includes(keyword) && keyword.length > 2,
      );
    });

    if (matchedResults.length > 0) {
      // Return ALL found results from the curated database
      return res.json(
        matchedResults.map((item) => ({
          ...item,
          severity: "found",
          advice_text: `Verified Guidance: ${item.advice_text} (Note: This is based on our medical database. Please consult a doctor if symptoms persist.)`,
          hospital_link: hospitalMap,
        })),
      );
    }

    // 3. AI ENGINE FALLBACKS (If Database has 0 matches)
    const systemPrompt = `
        ROLE: Professional AI Health Assistant for HealthSync.
        GUIDELINES:
        - Provide accurate, safe, and helpful health-related information.
        - If the user greets you (hi, hello, etc.), respond warmly.
        - ALWAYS ask follow-up questions if symptoms are vague.
        - Give general advice and possible causes, NEVER a medical diagnosis.
        - Encourage seeking professional medical help if symptoms are concerning.
        - Do NOT prescribe medications or dosages.
        - Be calm, empathetic, and professional.
      `;

    // Format and Clean History for Gemini (Ensures first message is from 'user')
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

    let botText = "";

    try {
      // --- Level A: Attempt Google Gemini 2.0 Flash (Primary) ---
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash", // ✅ FIXED: replaces deprecated gemini-1.5-flash-latest
        systemInstruction: systemPrompt,
      });

      const chat = model.startChat({ history: cleanedHistory });
      const result = await chat.sendMessage(symptom);
      botText = result.response.text();
    } catch (flashErr) {
      console.warn(
        "Gemini 2.0 Flash failed, attempting Gemini 2.5 Flash fallback...",
        flashErr.message,
      );

      try {
        // --- Level B: Attempt Google Gemini 2.5 Flash ---
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash", // ✅ FIXED: replaces deprecated gemini-pro
          systemInstruction: systemPrompt,
        });
        const chat = model.startChat({ history: cleanedHistory });
        const result = await chat.sendMessage(symptom);
        botText = result.response.text();
      } catch (proErr) {
        console.warn(
          "Gemini 2.5 Flash failed, attempting Hugging Face fallback...",
          proErr.message,
        );

        try {
          // --- Level C: Attempt Hugging Face (Mistral-7B) ---
          const hfResponse = await axios.post(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", // ✅ FIXED: .com → .co
            {
              inputs: `<s>[INST] ${systemPrompt} User Question: ${symptom} [/INST]`,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              },
            },
          );
          const fullText = hfResponse.data[0].generated_text;
          botText = fullText.split("[/INST]").pop().trim();
        } catch (hfErr) {
          // --- Level D: Final Safe Static Fallback ---
          console.warn("Hugging Face fallback failed:", hfErr.message);
          botText =
            "I couldn't find a specific match in our records. Based on your description, I recommend booking a consultation with one of our verified specialists for a professional evaluation.";
        }
      }
    }

    return res.json([
      {
        severity: "ai_generated",
        advice_text: botText,
        hospital_link: hospitalMap,
      },
    ]);
  } catch (err) {
    console.error("CRITICAL SYSTEM ERROR:", err.message);
    res.json([
      {
        severity: "unknown",
        advice_text:
          "I am experiencing a temporary processing delay. If you feel unwell, please book a consultation with one of our specialists or visit the nearest hospital.",
        hospital_link: hospitalMap,
      },
    ]);
  }
};
