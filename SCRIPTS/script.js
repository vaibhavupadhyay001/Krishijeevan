
function login() {
  const loginBtn = document.getElementById("login-btn");
  const welcomeText = document.getElementById("welcomeText");

  if (loginBtn && welcomeText) {
    loginBtn.classList.add("hidden");
    welcomeText.classList.remove("hidden");
    setTimeout(() => welcomeText.classList.add("show"), 50);
  }
}





window.addEventListener("load", () => {
  const nav = document.querySelector(".menu");
  if (nav) {
    const h = nav.offsetHeight || 64;
    document.documentElement.style.setProperty("--nav-h", h + "px");
  }
});


function toggleCropList() {
  const list = document.getElementById("cropList");
  list.style.display = list.style.display === "none" ? "block" : "none";
}

// s1 

const combinedSearch = document.getElementById("combinedSearch");
const searchBtn = document.getElementById("searchBtn");
const combinedList = document.getElementById("combinedList");
const items = document.querySelectorAll(".combined-item");

let isListVisible = false; 

combinedSearch.addEventListener("input", () => {
  const filter = combinedSearch.value.toLowerCase();
  let hasMatch = false;

  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(filter) && filter !== "") {
      item.style.display = "block";
      hasMatch = true;
    } else {
      item.style.display = "none";
    }
  });

  combinedList.style.display = hasMatch ? "block" : "none";
  if (hasMatch) isListVisible = true; 
});


searchBtn.addEventListener("click", () => {
  if (isListVisible) {
    
    combinedList.style.display = "none";
    isListVisible = false;
  } else {
    
    items.forEach(item => {
      item.style.display = "block";
    });
    combinedList.style.display = "block";
    isListVisible = true;
  }
});


items.forEach(item => {
  item.addEventListener("click", () => {
    combinedSearch.value = item.textContent;
    combinedList.style.display = "none";
    isListVisible = false;
  });
});




// s2 

const cropSearch = document.getElementById("cropSearch");
const cropList = document.getElementById("cropList");

cropSearch.addEventListener("keyup", function() {
  const filter = this.value.toLowerCase();
  const crops = document.querySelectorAll("#cropList .crop-item");

  if (filter.length > 0) {
    cropList.style.display = "block"; 
  } else {
    cropList.style.display = "none"; 
  }

  crops.forEach(crop => {
    const text = crop.textContent.toLowerCase();
    crop.style.display = text.includes(filter) ? "block" : "none";
  });
});

document.querySelectorAll(".crop-item").forEach(item => {
  item.addEventListener("click", () => {
    // alert("You selected crop: " + item.textContent); // removed
    cropList.style.display = "none"; 
    cropSearch.value = item.textContent; 
  });
});


// s3  


document.addEventListener("DOMContentLoaded", () => {
  const pathogenSearch = document.getElementById("pathogenSearch");
  const pathogenBtn = document.getElementById("pathogenBtn");
  const pathogenList = document.getElementById("pathogenList");
  const pathogenItems = document.querySelectorAll(".pathogen-item");
  let isPathogenVisible = false;


  pathogenSearch.addEventListener("input", () => {
    const filter = pathogenSearch.value.toLowerCase();
    let hasMatch = false;

    pathogenItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(filter) && filter !== "") {
        item.style.display = "block";
        hasMatch = true;
      } else {
        item.style.display = "none";
      }
    });

    pathogenList.style.display = hasMatch ? "block" : "none";
    if (hasMatch) isPathogenVisible = true;
  });

  
  pathogenBtn.addEventListener("click", () => {
    if (isPathogenVisible) {
      pathogenList.style.display = "none";
      isPathogenVisible = false;
    } else {
      pathogenItems.forEach(item => (item.style.display = "block"));
      pathogenList.style.display = "block";
      isPathogenVisible = true;
    }
  });


  pathogenItems.forEach(item => {
    item.addEventListener("click", () => {
      pathogenSearch.value = item.textContent;
      pathogenList.style.display = "none";
      isPathogenVisible = false;
    });
  });

});



//weather





const apiKey = "dd43d3d2e1ddf30ff7254ffb9eda9303"; // your API key

document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("cityInput");
  const locEl     = document.getElementById("weatherLocation");
  const tempEl    = document.getElementById("weatherTemp");
  const condEl    = document.getElementById("weatherCondition");

  function showMessage(msg) {
    locEl.textContent = msg;
    tempEl.textContent = "";
    condEl.textContent = "";
  }

  async function fetchWeather(city) {
    if (!city) {
      showMessage("⚠️ Please enter a city");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        showMessage("⚠️ " + (data.message || "City not found"));
        return;
      }

      locEl.textContent = `📍 Location: ${data.name}, ${data.sys.country}`;
      tempEl.textContent = `🌡️ Temperature: ${Math.round(data.main.temp)}°C`;
      condEl.textContent = `☁️ Condition: ${data.weather[0].description}`;
    } catch (err) {
      console.error("Fetch error:", err);
      showMessage("⚠️ Error fetching weather");
    }
  }

  // Auto fetch weather as user types (with small delay)
  let typingTimer;
  cityInput.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      fetchWeather(cityInput.value.trim());
    }, 800); // wait 800ms after typing stops
  });
});





// Crops with categories
const warmCrops = {
  "Cereals / Grains": ["Rice (Paddy)", "Maize (Corn)", "Millets", "Wheat"],
  "Pulses / Legumes": ["Moong (Green Gram)", "Urad (Black Gram)", "Chickpea (Gram / Chana)", "Lentils (Masoor)"],
  "Vegetables": ["Tomato", "Brinjal / Eggplant", "Cucumber", "Pumpkin & Squash", "Okra (Ladyfinger)", "Chili / Capsicum", "Cauliflower & Cabbage", "Spinach", "Fenugreek (Methi)"],
  "Fruits": ["Mango", "Banana", "Papaya", "Guava"],
  "Spices & Herbs": ["Ginger", "Turmeric", "Coriander", "Basil"]
};

// Function to populate crop list
function populateCropList() {
  recommendedCrops.innerHTML = ""; 
  for (const category in warmCrops) {
    const catLi = document.createElement("li");
    catLi.textContent = category;
    catLi.style.fontWeight = "bold";
    recommendedCrops.appendChild(catLi);

    warmCrops[category].forEach(crop => {
      const li = document.createElement("li");
      li.textContent = "  " + crop;
      recommendedCrops.appendChild(li);
    });
  }
}

// Show crops based on temperature
function showCrops(temp) {
  if (temp > 20) {
    cropSuggestion.style.display = "block";
    cropSuggestion.style.height = "30px"; 
    cropToggle.textContent = "🌱 Recommended Crops for this weather type ⬇";
  } else {
    cropSuggestion.style.display = "none";
  }
}

// Crop toggle click
cropToggle.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  
  // Case 1: No city entered
  if (!city) {
    recommendedCrops.innerHTML = "";
    const warningLi = document.createElement("li");
    warningLi.textContent = "⚠️ Please enter a city in the box above.";
    warningLi.style.color = "red";
    warningLi.style.marginRight = "30px";
    recommendedCrops.appendChild(warningLi);

    // Expand box to fit warning
    cropSuggestion.style.height = cropSuggestion.scrollHeight + "px";  
    cropToggle.textContent = "🌱 Recommended Crops for this weather type ⬇";
    return;
  }

  // Case 2: Toggle open
  if (cropSuggestion.style.height === "50px" || cropSuggestion.style.height === "") {
    cropSuggestion.style.height = "50px"; 
    cropToggle.textContent = "🌱 Loading...";

    recommendedCrops.innerHTML = "";
    const loadingLi = document.createElement("li");
    loadingLi.textContent = "Loading crops...";
    recommendedCrops.appendChild(loadingLi);

    // Simulate loading delay
    setTimeout(() => {
      populateCropList();
      cropSuggestion.style.height = cropSuggestion.scrollHeight + "px"; // expand fully
      cropToggle.textContent = "🌱 Recommended Crops ⬆";
    }, 2000); 
  } 
  // Case 3: Collapse back
  else {
    cropSuggestion.style.height = "50px"; 
    cropToggle.textContent = "🌱 Recommended Crops for this weather type ⬇";
  }
});

// Optional: Smooth expand/collapse with CSS
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = `
    #cropSuggestion {
      overflow: hidden;
      transition: height 0.5s ease;
    }
  `;
  document.head.appendChild(style);
});









// Disease cause and solution mapping

const diseaseData = {
  "Rice Blast": {
    cause: "Fungus Magnaporthe oryzae",
    solution: "Use resistant varieties, proper spacing, Tricyclazole spray, avoid excess nitrogen"
  },
  "Bacterial Leaf Blight (Rice)": {
    cause: "Bacterium Xanthomonas oryzae",
    solution: "Resistant varieties, balanced NPK, copper-based bactericides, avoid continuous flooding"
  },
  "Brown Spot (Rice)": {
    cause: "Fungus Bipolaris oryzae",
    solution: "Seed treatment with Carbendazim, apply potassium fertilizers, avoid excess nitrogen"
  },
  "Wheat Rust (Stem Rust)": {
    cause: "Fungus Puccinia graminis",
    solution: "Use resistant varieties, Propiconazole/Tebuconazole spray, remove volunteer plants"
  },
  "Leaf Rust (Wheat)": {
    cause: "Fungus Puccinia triticina",
    solution: "Resistant varieties, fungicide sprays if infection is severe"
  },
  "Powdery Mildew (Wheat)": {
    cause: "Fungus Blumeria graminis",
    solution: "Sulphur or Carbendazim sprays, proper spacing and airflow"
  },
  "Karnal Bunt (Wheat)": {
    cause: "Fungus Tilletia indica",
    solution: "Use certified disease-free seeds, crop rotation"
  },
  "Maize Downy Mildew": {
    cause: "Fungus Peronosclerospora spp.",
    solution: "Resistant varieties, seed treatment with Metalaxyl, proper field sanitation"
  },
  "Maize Streak Virus": {
    cause: "Virus transmitted by leafhoppers",
    solution: "Resistant varieties, remove infected plants, control leafhopper vector"
  },
  "Late Blight (Potato/Tomato)": {
    cause: "Fungus Phytophthora infestans",
    solution: "Fungicides Mancozeb/Metalaxyl, avoid overhead irrigation, remove infected debris"
  },
  "Early Blight (Tomato)": {
    cause: "Fungus Alternaria solani",
    solution: "Mancozeb/Chlorothalonil sprays, crop rotation, remove infected leaves"
  },
  "Tomato Leaf Curl Virus": {
    cause: "Virus transmitted by whiteflies",
    solution: "Remove infected plants, control whiteflies, resistant varieties"
  },
  "Powdery Mildew (Cucumber)": {
    cause: "Fungus Podosphaera xanthii",
    solution: "Sulphur or Tridemorph sprays, avoid high humidity"
  },
  "Fusarium Wilt (Tomato/Chili)": {
    cause: "Fungus Fusarium oxysporum",
    solution: "Resistant varieties, crop rotation, soil solarization"
  },
  "Mosaic Virus (Cucumber/Melon)": {
    cause: "Virus transmitted by aphids",
    solution: "Remove infected plants, control aphids, virus-free seeds"
  },
  "Anthracnose (Chili/Tomato)": {
    cause: "Fungus Colletotrichum spp.",
    solution: "Copper-based fungicides, remove infected fruits, field sanitation"
  },
  "Clubroot (Cabbage/Brassica)": {
    cause: "Fungus Plasmodiophora brassicae",
    solution: "Raise soil pH with lime, resistant varieties, crop rotation"
  },
  "Citrus Greening (Huanglongbing)": {
    cause: "Bacteria transmitted by psyllids",
    solution: "Remove infected trees, control psyllids"
  },
  "Mango Anthracnose": {
    cause: "Fungus Colletotrichum gloeosporioides",
    solution: "Copper sprays, prune infected branches, avoid wet foliage"
  },
  "Papaya Ringspot Virus": {
    cause: "Virus transmitted by aphids",
    solution: "Remove infected plants, control aphids, virus-free planting material"
  },
  "Banana Bunchy Top Virus": {
    cause: "Virus transmitted by banana aphid",
    solution: "Remove infected plants, control aphids, tissue culture plants"
  },
  "Apple Scab": {
    cause: "Fungus Venturia inaequalis",
    solution: "Captan or Mancozeb sprays, prune trees for airflow"
  },
  "Powdery Mildew (Grapes)": {
    cause: "Fungus Erysiphe necator",
    solution: "Sulphur sprays, remove infected leaves"
  },
  "Citrus Canker": {
    cause: "Bacterium Xanthomonas axonopodis",
    solution: "Copper sprays, remove infected plant material"
  },
  "Yellow Mosaic Virus (Pulses)": {
    cause: "Virus transmitted by whiteflies",
    solution: "Resistant varieties, remove infected plants, control whiteflies"
  },
  "Ascochyta Blight (Chickpea)": {
    cause: "Fungus Ascochyta rabiei",
    solution: "Mancozeb/Chlorothalonil sprays, crop rotation, certified seeds"
  },
  "Coffee Leaf Rust": {
    cause: "Fungus Hemileia vastatrix",
    solution: "Copper sprays, prune infected leaves, shade management"
  },
  "Tea Blight (Exobasidium)": {
    cause: "Fungus Exobasidium vexans",
    solution: "Bordeaux mixture sprays, remove infected shoots"
  },
  "Powdery Mildew (Sugarcane)": {
    cause: "Fungus Erysiphe sacchari",
    solution: "Sulphur or Carbendazim sprays, proper spacing"
  }
};


// References

const diseaseInfoSection = document.getElementById("diseaseInfo");
const backToListBtn = document.getElementById("backToListBtn");
const combinedItems = document.querySelectorAll(".combined-item");
const diseaseName = document.getElementById("diseaseName");
const diseaseCause = document.getElementById("diseaseCause");
const diseaseSolution = document.getElementById("diseaseSolution");


// Search Button

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("combinedSearch").value.trim().toLowerCase();

  const foundKey = Object.keys(diseaseData).find(key =>
    key.toLowerCase() === query.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim()
  );

  if (foundKey) {
    diseaseInfoSection.style.display = "block";
    diseaseName.textContent = "Loading...";
    diseaseCause.textContent = "";
    diseaseSolution.textContent = "";

    setTimeout(() => {
      diseaseName.textContent = foundKey;
      diseaseCause.textContent = diseaseData[foundKey].cause;
      diseaseSolution.textContent = diseaseData[foundKey].solution;
    }, 1000);
  } else {
    diseaseInfoSection.style.display = "block";
    diseaseName.textContent = "No data found";
    diseaseCause.textContent = "";
    diseaseSolution.textContent = "";
  }
});


// Click on list items

combinedItems.forEach(item => {
  item.addEventListener("click", () => {
    combinedItems.forEach(i => i.style.display = "none"); 
    item.style.display = "list-item"; 

    const diseaseNameClicked = item.textContent.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim();

    if (diseaseData[diseaseNameClicked]) {
      diseaseInfoSection.style.display = "block";
      diseaseName.textContent = "Loading...";
      diseaseCause.textContent = "";
      diseaseSolution.textContent = "";

      setTimeout(() => {
        diseaseName.textContent = diseaseNameClicked;
        diseaseCause.textContent = diseaseData[diseaseNameClicked].cause;
        diseaseSolution.textContent = diseaseData[diseaseNameClicked].solution;
      }, 500);
    } else {
      diseaseInfoSection.style.display = "block";
      diseaseName.textContent = "No data found";
      diseaseCause.textContent = "";
      diseaseSolution.textContent = "";
    }
  });
});


// Back to list button
backToListBtn.addEventListener("click", () => {
  diseaseInfoSection.style.display = "none"; 
  document.getElementById("combinedList").style.display = "none"; 

  combinedItems.forEach(item => {
    item.style.display = "none"; 
  });

  document.getElementById("combinedSearch").value = ""; 
});



 //s2 search bar...


const cropItems = document.querySelectorAll("#cropList .crop-item");
const cropInfoSection = document.getElementById("cropInfoSection");
const cropInfoTitle = document.getElementById("cropInfoTitle");
const cropWater = document.getElementById("cropWater");
const cropCost = document.getElementById("cropCost");
const cropTips = document.getElementById("cropTips");
const backToCropList = document.getElementById("backToCropList");


const cropData = {
  "Rice": { water: "8–12 times per acre", cost: "₹30,000–35,000", tips: "Clay soil, transplant seedlings, use fertilizers, remove weeds." },
  "Maize": { water: "5–7 times per acre", cost: "₹25,000–30,000", tips: "Loamy soil, plant seeds 60×20 cm apart, use fertilizers, control pests." },
  "Wheat": { water: "3–4 times per acre", cost: "₹20,000–25,000", tips: "Loamy soil, sow in Oct–Nov, use NPK fertilizers." },
  "Potato": { water: "10–12 times per acre", cost: "₹35,000–40,000", tips: "Sandy soil, plant tubers 60×20 cm apart, use compost and fertilizers." },
  "Tomato": { water: "8–10 times per acre", cost: "₹30,000–35,000", tips: "Loamy soil, use stakes for support, apply compost/fertilizers, control pests." },
  "Brinjal": { water: "6–8 times per acre", cost: "₹25,000–30,000", tips: "Loamy soil, use stakes, fertilize, control pests." },
  "Cucumber": { water: "6–8 times per acre", cost: "₹20,000–25,000", tips: "Sandy soil, use trellis, apply compost and fertilizers." },
  "Orange": { water: "6–8 times per acre", cost: "₹50,000–60,000", tips: "Citrus soil, drip irrigation, fertilize, check for pests." },
  "Banana": { water: "12–15 times per acre", cost: "₹40,000–50,000", tips: "Loamy soil, use mulch, fertilize, plant tissue-culture saplings." },
  "Mango": { water: "4–5 times per season", cost: "₹35,000–45,000", tips: "Loamy soil, add compost/fertilizers, prune trees, check for pests." },
  "Coffee": { water: "5–6 times per acre", cost: "₹60,000–70,000", tips: "Shade-grown, acidic soil, compost, mulch, check for pests." },
  "Tea": { water: "8–10 times per acre", cost: "₹50,000–60,000", tips: "Acidic soil, prune plants, apply compost/fertilizers, pluck leaves regularly." }
};

// Show crop info

cropItems.forEach(item => {
  item.addEventListener("click", () => {
    const cropName = item.textContent.replace(/^[^\w]*\s*/, ''); 
    if(cropData[cropName]) {
      cropInfoTitle.textContent = `🌱 ${cropName} Information`;
      cropWater.textContent = cropData[cropName].water;
      cropCost.textContent = cropData[cropName].cost;
      cropTips.textContent = cropData[cropName].tips;
      cropInfoSection.style.display = "block";
      
    
      cropItems.forEach(i => {
        if(i !== item) i.style.display = "none";
      });
    }
  });
});


backToCropList.addEventListener("click", () => {
  cropItems.forEach(i => i.style.display = "list-item");
  cropInfoSection.style.display = "none";
});




// Search Button
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("combinedSearch").value.trim().toLowerCase();


  if (query === "") {
    diseaseInfoSection.style.display = "block";
    diseaseName.textContent = "Please select a crop disease";
    diseaseCause.textContent = "";
    diseaseSolution.textContent = "";
    return;
  }


  const foundKey = Object.keys(diseaseData).find(key =>
    key.toLowerCase() === query.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim()
  );

  if (foundKey) {
    diseaseInfoSection.style.display = "block";
    diseaseName.textContent = "Loading...";
    diseaseCause.textContent = "";
    diseaseSolution.textContent = "";

    setTimeout(() => {
      diseaseName.textContent = foundKey;
      diseaseCause.textContent = diseaseData[foundKey].cause;
      diseaseSolution.textContent = diseaseData[foundKey].solution;
    }, 1000);
  } else {
    diseaseInfoSection.style.display = "block";
    diseaseName.textContent = "No data found";
    diseaseCause.textContent = "";
    diseaseSolution.textContent = "";
  }
});



// search Pathogen data

const pathogenData = {
  "Bacteria": {
    reason: "Spread by water, wind, or cuts in plant. Causes blight, canker.",
    control: "Spray copper medicine (Copper oxychloride), Streptocycline. Use balanced fertilizer."
  },
  "Virus": {
    reason: "Spread by insects like whiteflies, aphids. Causes leaf curl, yellow leaves.",
    control: "No direct cure. Remove sick plants. Spray for insects (Imidacloprid, Thiamethoxam). Use resistant seeds."
  },
  "Fungi": {
    reason: "Grow in wet and humid weather. Cause rust, blight, mildew.",
    control: "Spray Mancozeb, Carbendazim, Propiconazole. Keep fields clean."
  },
  "Nematodes": {
    reason: "Small worms in soil damage roots. Plants become weak.",
    control: "Use Carbofuran (Furadan), Neem cake. Do crop rotation."
  },
  "Phytoplasma": {
    reason: "Spread by leafhopper insects. Plants show little leaves, flowers turn green.",
    control: "Remove sick plants. Spray for leafhoppers (Imidacloprid, Acetamiprid)."
  },
  "Blight (Phytophthora)": {
    reason: "Disease in potato/tomato. Leaves turn brown/black.",
    control: "Spray Mancozeb, Metalaxyl. Do not over-water."
  },
  "Rust (Puccinia)": {
    reason: "Fungus on wheat and pulses. Makes brown/orange powder spots.",
    control: "Spray Propiconazole, Mancozeb. Use resistant seeds."
  },
  "Wilt (Fusarium)": {
    reason: "Fungus blocks water in plant. Plant wilts and dies.",
    control: "Spray Carbendazim. Use Trichoderma bio-fungicide. Rotate crops."
  },
  "Mosaic Virus": {
    reason: "Spread by aphids/whiteflies. Leaves look yellow, curled, or patchy.",
    control: "Remove sick plants. Spray Neem oil or Imidacloprid. Use healthy seeds."
  },
  "Leaf Spot (Alternaria)": {
    reason: "Fungus makes black/brown spots on leaves.",
    control: "Spray Mancozeb, Copper medicine. Avoid extra watering on leaves."
  }
};

// Elements
const pathogenItems = document.querySelectorAll(".pathogen-item");
const pathogenInfo = document.getElementById("pathogenInfo");
const pathogenName = document.getElementById("pathogenName");
const pathogenReason = document.getElementById("pathogenReason");
const pathogenControl = document.getElementById("pathogenControl");
const backToPathogenList = document.getElementById("backToPathogenList");
const pathogenList = document.getElementById("pathogenList");

// Show pathogen info on click
pathogenItems.forEach(item => {
  item.addEventListener("click", () => {
    const cleanName = item.textContent.replace(/^[^\w]*\s*/, ''); // remove emoji
    if (pathogenData[cleanName]) {
      pathogenList.style.display = "none";
      pathogenInfo.style.display = "block";
      pathogenName.textContent = `🔍 ${cleanName}`;
      pathogenReason.textContent = pathogenData[cleanName].reason;
      pathogenControl.textContent = pathogenData[cleanName].control;
    }
  });
});

// Back button → hide everything
backToPathogenList.addEventListener("click", () => {
  pathogenInfo.style.display = "none";
  pathogenList.style.display = "none"; 
});

const cropRecommendations = {
  low: ["🌾 Wheat", "🌱 Pulses (Chickpea, Lentil, Moong)", "🌿 Millets (Bajra, Jowar, Ragi)"],
  medium: ["🌾 Rice", "🌽 Maize", "🥔 Potato", "🍅 Tomato", "🍆 Brinjal", "🥒 Cucumber"],
  high: ["🍌 Banana", "🍊 Orange", "🥭 Mango", "☕ Coffee", "🍵 Tea"]
};

document.getElementById("findCropsBtn").addEventListener("click", () => {
  const budget = parseInt(document.getElementById("budgetInput").value);
  const loadingMsg = document.getElementById("loadingMsg");
  const resultBox = document.getElementById("budgetResult");
  const cropList = document.getElementById("cropResultList");

  cropList.innerHTML = ""; 
  resultBox.style.display = "none";

  if (isNaN(budget) || budget < 19000) {
    alert("⚠️ Please enter a valid amount greater than 19000 .");
    return;
  }

  
  loadingMsg.style.display = "block";

  setTimeout(() => {
    loadingMsg.style.display = "none";
    resultBox.style.display = "block";

    let crops = [];
    if (budget <= 25000) {
      crops = cropRecommendations.low;
    } else if (budget > 25000 && budget <= 40000) {
      crops = cropRecommendations.medium;
    } else {
      crops = cropRecommendations.high;
    }

    crops.forEach(crop => {
      const li = document.createElement("li");
      li.textContent = crop;
      cropList.appendChild(li);
    });
  }, 2000); 
});






function toggleMenu() {
      document.querySelector('.menu-links').classList.toggle('active');
    }
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,mr,ta,te,bho',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    }


