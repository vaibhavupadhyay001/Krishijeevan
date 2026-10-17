document.addEventListener("DOMContentLoaded", () => {
  // Production backend hosted on Render
  const API_URL = "https://krishijeevan.onrender.com/api/analyze";

  const clickPhotoBtn = document.getElementById("clickPhoto");
  const galleryBtn = document.getElementById("uploadGallery");
  const galleryInput = document.getElementById("galleryInput");
  const cameraPreview = document.getElementById("cameraPreview");
  const preview = document.getElementById("preview");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const switchCameraBtn = document.getElementById("switchCameraBtn");
  const resultBox = document.getElementById("resultBox");
  const stepsSection = document.getElementById("stepsSection");

  if (
    !clickPhotoBtn ||
    !galleryBtn ||
    !galleryInput ||
    !cameraPreview ||
    !preview ||
    !analyzeBtn ||
    !switchCameraBtn ||
    !resultBox ||
    !stepsSection
  ) {
    console.error("Crop Analyzer: Required HTML elements are missing.");
    return;
  }

  let capturedImage = null;
  let currentStream = null;
  let useFrontCamera = false;
  let resultShown = false;
  let isAnalyzing = false;

  console.log("Crop Analyzer initialized.");

  // STOP CAMERA
  function stopCamera() {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      currentStream = null;
    }

    cameraPreview.srcObject = null;
    cameraPreview.style.display = "none";
  }

  // START CAMERA
  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Camera unavailable. Please use localhost or HTTPS.");
      return;
    }

    stopCamera();

    try {
      currentStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: useFrontCamera ? "user" : "environment"
        },
        audio: false
      });

      cameraPreview.srcObject = currentStream;
      cameraPreview.style.display = "block";
      await cameraPreview.play();

      preview.style.display = "none";
      resultBox.style.display = "none";
      stepsSection.style.display = "none";

      galleryBtn.style.display = "flex";
      switchCameraBtn.style.display = "inline-block";
      analyzeBtn.style.display = "inline-block";
      analyzeBtn.textContent = "Analyze Crop / फसल विश्लेषण करें";
      analyzeBtn.disabled = false;

      capturedImage = null;
      resultShown = false;
    } catch (error) {
      console.error("Camera error:", error);

      const messages = {
        NotAllowedError:
          "Camera permission denied. Please allow camera access.",
        NotFoundError:
          "No camera was found on this device.",
        NotReadableError:
          "Camera is already being used by another application."
      };

      alert(messages[error.name] || "Unable to access the camera.");
    }
  }

  clickPhotoBtn.addEventListener("click", startCamera);

  clickPhotoBtn.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      startCamera();
    }
  });

  // SWITCH CAMERA
  switchCameraBtn.addEventListener("click", () => {
    useFrontCamera = !useFrontCamera;
    startCamera();
  });

  // GALLERY BUTTON
  galleryBtn.addEventListener("click", () => {
    galleryInput.click();
  });

  // HANDLE SELECTED IMAGE
  galleryInput.addEventListener("change", event => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      galleryInput.value = "";
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert("Please select an image smaller than 15 MB.");
      galleryInput.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = event => {
      if (typeof event.target.result !== "string") {
        alert("Unable to read the selected image.");
        galleryInput.value = "";
        return;
      }

      capturedImage = event.target.result;

      stopCamera();

      preview.src = capturedImage;
      preview.style.display = "block";

      switchCameraBtn.style.display = "none";
      analyzeBtn.style.display = "inline-block";
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "Analyze Crop / फसल विश्लेषण करें";

      resultBox.style.display = "none";
      stepsSection.style.display = "none";
      galleryBtn.style.display = "flex";

      resultShown = false;
      galleryInput.value = "";

      console.log("Image selected successfully:", file.name);
    };

    reader.onerror = () => {
      console.error("Image reading failed.");
      alert("Unable to read this image. Please try another image.");
      galleryInput.value = "";
    };

    reader.readAsDataURL(file);
  });

  // ANALYZE / BACK BUTTON
  analyzeBtn.addEventListener("click", async () => {
    if (resultShown) {
      stopCamera();

      resultBox.style.display = "none";
      preview.style.display = "none";
      galleryBtn.style.display = "flex";
      stepsSection.style.display = "block";

      analyzeBtn.style.display = "none";
      switchCameraBtn.style.display = "none";

      capturedImage = null;
      resultShown = false;
      return;
    }

    if (isAnalyzing) return;

    let imageData = capturedImage;

    // Capture frame from camera
    if (!imageData && cameraPreview.srcObject) {
      if (!cameraPreview.videoWidth || !cameraPreview.videoHeight) {
        alert("Camera is not ready yet. Please wait a moment.");
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = cameraPreview.videoWidth;
      canvas.height = cameraPreview.videoHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        alert("Unable to capture the camera image.");
        return;
      }

      context.drawImage(
        cameraPreview,
        0,
        0,
        canvas.width,
        canvas.height
      );

      imageData = canvas.toDataURL("image/jpeg");
      capturedImage = imageData;
    }

    if (!imageData) {
      alert("Please capture or upload an image first.");
      return;
    }

    stopCamera();

    preview.src = imageData;
    preview.style.display = "block";

    resultBox.style.display = "block";
    resultBox.textContent = "Analyzing crop... कृपया प्रतीक्षा करें...";

    isAnalyzing = true;
    analyzeBtn.disabled = true;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // Keep the property name expected by your existing backend
        body: JSON.stringify({ imageData })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Backend error:", response.status, data);

        resultBox.textContent =
          data.error ||
          data.detail ||
          `Crop analysis failed (HTTP ${response.status}). Please try again.`;

        return;
      }

      const raw = data.result || "";

      if (!raw) {
        resultBox.textContent =
          "No analysis was returned. Please try again.";
        return;
      }

      const cropMatch = raw.match(/crop:\s*(.+)/i);
      const diseaseMatch = raw.match(/disease:\s*(.+)/i);
      const solutionMatch = raw.match(/solution:\s*(.+)/i);

      const crop = cropMatch
        ? cropMatch[1].trim()
        : "Unknown";

      const disease = diseaseMatch
        ? diseaseMatch[1].trim()
        : "Unable to identify";

      const solution = solutionMatch
        ? solutionMatch[1].trim()
        : "Consult a local agriculture expert";

      resultBox.innerHTML = `
        <b>🌾 Crop:</b> ${escapeHTML(crop)}<br>
        <b>🦠 Disease:</b> ${escapeHTML(disease)}<br>
        <b>💡 Solution:</b> ${escapeHTML(solution)}
      `;

      analyzeBtn.textContent = "⬅ Back";
      resultShown = true;
    } catch (error) {
      console.error("Backend connection error:", error);

      resultBox.textContent =
        "Unable to connect to the crop analysis server. Please check your internet connection and try again.";
    } finally {
      isAnalyzing = false;
      analyzeBtn.disabled = false;
    }
  });

  // Safely display AI-generated text
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  // Release camera when leaving the page
  window.addEventListener("pagehide", stopCamera);
});
