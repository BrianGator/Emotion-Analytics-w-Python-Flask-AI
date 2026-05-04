import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Emotion Detection Endpoint
  app.post("/api/analyze", async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        anger: null,
        disgust: null,
        fear: null,
        joy: null,
        sadness: null,
        dominant_emotion: null,
        error: "Invalid text! Please provide feedback to analyze."
      });
    }

    try {
      // Phase 1: Try Watson NLP API (as requested in project guidelines)
      const watsonUrl = 'https://sn-watson-emotion.labs.skills.network/v1/watson.runtime.nlp.v1/NlpService/EmotionPredict';
      const watsonHeaders = {
        "Content-Type": "application/json",
        "grpc-metadata-mm-model-id": "emotion_aggregated-workflow_lang_en_stock"
      };
      const watsonBody = { "raw_document": { "text": text } };

      try {
        const watsonResponse = await fetch(watsonUrl, {
          method: 'POST',
          headers: watsonHeaders,
          body: JSON.stringify(watsonBody)
        });

        if (watsonResponse.ok) {
          const data: any = await watsonResponse.json();
          const emotions = data.emotionPredictions[0].emotion;
          
          let dominant_emotion = "";
          let maxScore = -1;
          for (const [emotion, score] of Object.entries(emotions)) {
            if ((score as number) > maxScore) {
              maxScore = score as number;
              dominant_emotion = emotion;
            }
          }

          return res.json({
            ...emotions,
            dominant_emotion
          });
        }
      } catch (e) {
        console.warn("Watson API unreachable or failed, falling back to Gemini.");
      }

      // Phase 2: Fallback to Gemini AI if Watson is unavailable (common outside IBM lab)
      const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Analyze the following customer feedback text and output ONLY a JSON object containing the scores for these emotions: anger, disgust, fear, joy, and sadness. Each score should be between 0.0 and 1.0. Also include a "dominant_emotion" field.
      
      Text: "${text}"
      
      JSON format example:
      {
        "anger": 0.01,
        "disgust": 0.02,
        "fear": 0.0,
        "joy": 0.95,
        "sadness": 0.02,
        "dominant_emotion": "joy"
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return res.json(analysis);
      } else {
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      return res.status(500).json({ error: "System error during analysis. Please try again later." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
