const db = require("../config/db");
const axios = require("axios"); // Required for Hugging Face API
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAdvice = async (req, res) => {
  // Support both POST (req.body) and GET (req.query) for maximum compatibility
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
          "URGENT: Your symptoms indicate a high-risk situation. Please call 911 or your local emergency number immediately. Do not attempt to self-treat. Proceed to the nearest hospital now.",
        hospital_link: hospitalMap,
      },
    ]);
  }

  try {
    // 2. MULTI-MATCH DATABASE SEARCH (Prioritize your specific medical records)
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
          advice_text: `Verified Guidance: ${item.advice_text} (Note: This is based on our curated medical database.)`,
          hospital_link: hospitalMap,
        })),
      );
    }

    // 3. AI ENGINE FALLBACKS
    const systemPrompt = `ROLE: Professional AI Health Assistant. Provide accurate, safe, helpful health info. NEVER diagnose. Suggest booking a doctor if symptoms persist. Be calm and professional.`;
    let botText = "";

    try {
      // --- Level A: Attempt Google Gemini Flash ---
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt,
      });

      // Format history (Gemini requires first message to be from 'user')
      let cleanedHistory = (history || [])
        .map((item) => ({
          role:
            item.sender === "bot" || item.role === "model" ? "model" : "user",
          parts: Array.isArray(item.parts)
            ? item.parts
            : [{ text: item.text || "" }],
        }))
        .filter((item) => item.parts[0].text.length > 0);
      if (cleanedHistory.length > 0 && cleanedHistory[0].role === "model")
        cleanedHistory.shift();

      const chat = model.startChat({ history: cleanedHistory });
      const result = await chat.sendMessage(symptom);
      botText = result.response.text();
    } catch (geminiErr) {
      console.warn("Gemini Failed, attempting Hugging Face Fallback...");

      try {
        // --- Level B: Attempt Hugging Face (Mistral-7B) ---
        const hfResponse = await axios.post(
          "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
          {
            inputs: `<s>[INST] ${systemPrompt} User Question: ${symptom} [/INST]`,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            },
          },
        );

        // Extracting text from Hugging Face structure
        const fullText = hfResponse.data[0].generated_text;
        botText = fullText.split("[/INST]").pop().trim();
      } catch (hfErr) {
        console.error("Hugging Face also failed:", hfErr.message);
        // --- Level C: Final Fallback ---
        botText =
          "I am experiencing a high volume of requests. Based on your symptoms, I strongly recommend booking a consultation with one of our verified specialists for a safe evaluation.";
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
    console.error("AI SYSTEM ERROR:", err.message);
    res.json([
      {
        severity: "unknown",
        advice_text:
          "I am experiencing a slight delay in processing. If you feel unwell, please book a consultation with one of our specialists using the buttons below.",
        hospital_link: hospitalMap,
      },
    ]);
  }
};
