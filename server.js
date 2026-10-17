
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const WEATHER_API_KEY = process.env.VITE_API_KEY;

app.use(cors());
app.use(express.json({ limit: "15mb" }));

// API health check
app.get("/", (req, res) => {
  res.json({
    message: "Crop Analyzer API is running!",
    weather: "Available at /api/weather?city=Lucknow",
  });
});

// ========================================
// WEATHER API
// ========================================

app.get("/api/weather", async (req, res) => {
  try {
    const city = String(req.query.city || "").trim();

    if (!city) {
      return res.status(400).json({
        error: "Please provide a city name.",
      });
    }

    if (city.length > 100) {
      return res.status(400).json({
        error: "City name is too long.",
      });
    }

    if (!WEATHER_API_KEY) {
      return res.status(500).json({
        error: "Weather API key is missing in server .env",
      });
    }

    const url = new URL(
      "https://api.openweathermap.org/data/2.5/weather"
    );

    url.searchParams.set("q", city);
    url.searchParams.set("appid", WEATHER_API_KEY);
    url.searchParams.set("units", "metric");

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("Weather API status:", response.status);

      const status =
        response.status === 401 ? 502 :
        response.status === 404 ? 404 :
        response.status === 429 ? 429 : 502;

      return res.status(status).json({
        error:
          response.status === 401
            ? "Weather API key is invalid or not activated."
            : response.status === 404
            ? "City not found. Check the spelling."
            : response.status === 429
            ? "Weather API request limit reached."
            : data.message || "Unable to fetch weather.",
      });
    }

    return res.json({
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather?.[0]?.description || "Unavailable",
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    });
  } catch (error) {
    console.error("Weather error:", error);

    return res.status(500).json({
      error: "Unable to fetch weather. Please try again.",
    });
  }
});

// ========================================
// CROP IMAGE ANALYSIS
// ========================================

app.post("/api/analyze", async (req, res) => {
  try {
    const { imageData } = req.body;

    if (!GROQ_API_KEY) {
      return res.status(500).json({
        error: "Groq API key is missing in server .env",
      });
    }

    if (
      typeof imageData !== "string" ||
      !/^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(imageData)
    ) {
      return res.status(400).json({
        error: "Please provide a valid image.",
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "qwen/qwen3.8-27b",
          messages: [
            {
              role: "system",
              content: `
You are a crop disease identification assistant.

Analyze the supplied crop image and respond in exactly 3 lines:

Crop: English name (Hindi name)
Disease: English name (Hindi name)
Solution: English solution (Hindi solution)

Rules:
- Keep each English and Hindi value to 1-2 words.
- Write Hindi in Devanagari script.
- No explanations, scientific names, or extra text.
- If the crop is unclear, write Unknown (अज्ञात).
- If no disease is visible, write No disease (कोई रोग नहीं).
- If uncertain, write Uncertain (अनिश्चित).
- Never claim a disease is confirmed from an unclear image.
- Suggest a short treatment keyword.

Example:
Crop: Barley (जौ)
Disease: Net blotch (जाल धब्बा)
Solution: Fungicide spray (फफूंदनाशक छिड़काव)
              `.trim(),
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text:
                    "Identify the crop, visible disease, and short treatment. Include Hindi translations in brackets.",
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageData,
                  },
                },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens: 100,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API status:", response.status);
      console.error(
        "Groq API details:",
        JSON.stringify(data, null, 2)
      );

      return res.status(502).json({
        error: data.error?.message || "Groq API request failed.",
      });
    }

    const result =
      data.choices?.[0]?.message?.content?.trim();

    if (!result) {
      return res.status(502).json({
        error: "No analysis was returned.",
      });
    }

    // Preserve Hindi translations and brackets.
    const getValue = (label, fallback) => {
      const match = result.match(
        new RegExp(`^\\s*${label}\\s*:\\s*(.+?)\\s*$`, "im")
      );

      return match
        ? match[1].replace(/[*#`]/g, "").trim()
        : fallback;
    };

    const shortResult = [
      `Crop: ${getValue("Crop", "Unknown (अज्ञात)")}`,
      `Disease: ${getValue("Disease", "Uncertain (अनिश्चित)")}`,
      `Solution: ${getValue("Solution", "Unknown (अज्ञात)")}`,
    ].join("\n");

    return res.json({ result: shortResult });
  } catch (error) {
    console.error("Analysis error:", error);

    return res.status(500).json({
      error: "Unable to analyze the image. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Crop Analyzer API running at http://localhost:${PORT}`);
});
