# 🌱 KrishiJeevan — AI-Powered Crop Analysis & Farming Assistant

KrishiJeevan is an AI-powered agricultural web application designed to help farmers make informed farming decisions through crop image analysis, real-time weather information, and AI-generated agricultural guidance.

The platform combines a simple, accessible interface with AI and weather APIs to make useful farming insights easier to access.

<p align="left">
  <a href="https://krishijeevan.onrender.com/">
    <img src="https://img.shields.io/badge/Backend-Live-46a758?style=for-the-badge" alt="Live Backend" />
  </a>
  <a href="https://github.com/vaibhavupadhyay001/Krishijeevan">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
</p>

## 🔗 Live Links

- **Frontend:** [Open KrishiJeevan](https://krishijeevan.vercel.app/)
- **Backend API:** [https://krishijeevan.onrender.com/](https://krishijeevan.onrender.com/)
- **Weather API:** [Test Weather Endpoint](https://krishijeevan.onrender.com/api/weather?city=Lucknow)
- **GitHub Repository:** [vaibhavupadhyay001/Krishijeevan](https://github.com/vaibhavupadhyay001/Krishijeevan)

## ✨ Features

- **AI-Powered Crop Analysis:** Analyze crop images using an AI-powered backend.
- **Camera Integration:** Capture images directly from a device camera.
- **Gallery Upload:** Upload existing crop images for analysis.
- **Real-Time Weather:** Retrieve current weather conditions for a selected city.
- **Agricultural Guidance:** Receive AI-generated crop information, potential disease identification, and suggested solutions.
- **Responsive Interface:** Access the application through supported desktop and mobile browsers.
- **Secure API Configuration:** Keep AI and weather API credentials on the backend instead of exposing them in frontend code.

## ⚙️ How It Works

1. The user captures a crop image or uploads one from the gallery.
2. The frontend sends the image to the backend API.
3. The backend forwards the image to the configured AI provider for analysis.
4. The AI response provides crop identification, possible disease information, and suggested solutions.
5. Users can also enter a city to retrieve current weather information through the backend.

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript
- Browser Camera API

### Backend
- Node.js
- Express.js
- REST APIs

### AI & External APIs
- Groq API — AI-powered image analysis
- OpenWeatherMap API — Current weather data

### Deployment
- Vercel — Frontend hosting
- Render — Backend hosting

## 📁 Project Structure

```text
Krishijeevan/
├── HTML/
│   └── camera.html
├── IMAGES/
├── SCRIPTS/
│   ├── main.js
│   ├── script.js
│   └── config.js
├── STYLES/
├── assets/
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A Groq API key
- An OpenWeatherMap API key

### 1. Clone the Repository

```bash
git clone https://github.com/vaibhavupadhyay001/Krishijeevan.git
cd Krishijeevan
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
VITE_API_KEY=your_openweathermap_api_key
PORT=3000
```

Replace the placeholder values with your own API credentials. Never commit your actual `.env` file or expose secret keys in frontend JavaScript.

### 4. Start the Backend

```bash
npm run server
```

The backend should start on `http://localhost:3000`, assuming the project uses the corresponding npm script.

### 5. Start the Frontend

In a separate terminal, start the Vite development server if configured:

```bash
npm run dev
```

Open the local URL printed by Vite. Ensure the frontend API URLs point to the local backend during development.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend health check |
| GET | `/api/weather?city=Lucknow` | Retrieves current weather for a city |
| POST | `/api/analyze` | Analyzes a crop image using AI |

### Image Analysis Request

The image analysis endpoint accepts a JSON request containing the image data. For example, if the backend expects the `imageData` field:

```json
{
  "imageData": "data:image/jpeg;base64,..."
}
```

The exact request format must match the backend implementation.

## 🔐 Security

- Store API credentials in server-side environment variables.
- Keep `.env` excluded from Git using `.gitignore`.
- Never publish API keys in source code, screenshots, or repository commits.
- Configure environment variables separately in your hosting provider's dashboard.
- Validate uploaded image types and sizes before processing.

## 🔮 Future Improvements

- Multilingual support for regional farming communities.
- Soil-based crop recommendations.
- Fertilizer and irrigation guidance.
- Yield prediction and seasonal planning.
- More detailed crop disease detection and prevention guidance.

## 👨‍💻 Author

**Vaibhav Upadhyay**

- GitHub: [@vaibhavupadhyay001](https://github.com/vaibhavupadhyay001)

---

*KrishiJeevan — Making AI-powered agricultural insights more accessible.*
