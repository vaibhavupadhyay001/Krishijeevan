// Use key from config.js
const OPENAI_API_KEY = window.OPENAI_API_KEY;

const clickPhotoBtn = document.getElementById('clickPhoto');
const galleryBtn = document.getElementById('uploadGallery');
const galleryInput = document.getElementById('galleryInput');
const cameraPreview = document.getElementById('cameraPreview');
const preview = document.getElementById('preview');
const analyzeBtn = document.getElementById('analyzeBtn');
const switchCameraBtn = document.getElementById('switchCameraBtn');
const resultBox = document.getElementById('resultBox');
const stepsSection = document.getElementById('stepsSection');

let capturedImage = null;
let currentStream = null;
let useFrontCamera = false;
let resultShown = false;

// Start camera
async function startCamera() {
  if (currentStream) currentStream.getTracks().forEach(track => track.stop());
  try {
    const constraints = { video: { facingMode: useFrontCamera ? "user" : "environment" } };
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    cameraPreview.srcObject = currentStream;
    cameraPreview.style.display = 'block';
    switchCameraBtn.style.display = 'inline-block';
    analyzeBtn.style.display = 'inline-block';
    analyzeBtn.textContent = "Analyze Crop / फसल विश्लेषण करें";
    preview.style.display = 'none';
    resultBox.style.display = 'none';
    galleryBtn.style.display = 'inline-block';
    resultShown = false;
  } catch (err) {
    alert('Camera access denied / कैमरा एक्सेस अस्वीकृत');
  }
}

// Click photo
clickPhotoBtn.addEventListener('click', () => {
  stepsSection.style.display = 'none';
  startCamera();
});

switchCameraBtn.addEventListener('click', () => {
  useFrontCamera = !useFrontCamera;
  startCamera();
});

// File upload
galleryBtn.addEventListener('click', () => galleryInput.click());
galleryInput.addEventListener('change', e => {
  stepsSection.style.display = 'none';
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(ev) {
      capturedImage = ev.target.result;
      preview.src = capturedImage;
      preview.style.display = 'block';
      cameraPreview.style.display = 'none';
      switchCameraBtn.style.display = 'none';
      analyzeBtn.style.display = 'inline-block';
      analyzeBtn.textContent = "Analyze Crop / फसल विश्लेषण करें";
      galleryBtn.style.display = 'inline-block';
      resultShown = false;
    };
    reader.readAsDataURL(file);
  }
});

// Analyze / Back button
analyzeBtn.addEventListener('click', async () => {
  if (!resultShown) {
    let imageData = capturedImage;
    if (!imageData && cameraPreview.srcObject) {
      const canvas = document.createElement('canvas');
      canvas.width = cameraPreview.videoWidth;
      canvas.height = cameraPreview.videoHeight;
      canvas.getContext('2d').drawImage(cameraPreview, 0, 0);
      imageData = canvas.toDataURL('image/jpeg');
      capturedImage = imageData;
    }
    if (!imageData) { alert("Please capture or upload an image first"); return; }

    cameraPreview.style.display = 'none';
    switchCameraBtn.style.display = 'none';
    preview.src = imageData;
    preview.style.display = 'block';

    resultBox.style.display = 'block';
    resultBox.innerHTML = "Analyzing... कृपया प्रतीक्षा करें...";

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            { role: "system", content: "You are an agriculture expert. From the image, detect the crop name and any disease. Respond strictly in this format:\nCrop: <name>\nDisease: <max 5 words>\nSolution: <max 5 words>.\nNothing else." },
            { role: "user", content: [
              { type: "text", text: "Analyze this crop image and return crop name, disease, and solution." },
              { type: "image_url", image_url: { url: imageData } }
            ]}
          ]
        })
      });

      if (!response.ok) {
        if (response.status === 401) resultBox.innerHTML = "Please try again.";
        else if (response.status === 429) resultBox.innerHTML = "⚠️ Too many requests. Try again later.";
        else resultBox.innerHTML = "⚠️ Model is not responding. Try again later.";
        return;
      }

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content || "⚠️ No result";

      const cropMatch = raw.match(/(?<=crop:)\s*.+/i);
      const diseaseMatch = raw.match(/(?<=disease:)\s*.+/i);
      const solutionMatch = raw.match(/(?<=solution:)\s*.+/i);

      const crop = cropMatch ? cropMatch[0].trim() : "Unknown";
      const disease = diseaseMatch ? diseaseMatch[0].trim() : "No disease found";
      const solution = solutionMatch ? solutionMatch[0].trim() : "No solution needed.";

      resultBox.innerHTML = `
        <b>🌾 Crop: </b> ${crop}<br>
        <b>🦠 Disease: </b> ${disease}<br>
        <b>💡 Solution: </b> ${solution}
      `;

      analyzeBtn.textContent = "⬅ Back";
      resultShown = true;

    } catch (err) {
      console.error(err);
      resultBox.innerHTML = "⚠️ Something went wrong. Try again later.";
    }

  } else {
    resultBox.style.display = 'none';
    preview.style.display = 'none';
    galleryBtn.style.display = 'inline-block';
    stepsSection.style.display = 'block';
    startCamera();
    resultShown = false;
  }
});
