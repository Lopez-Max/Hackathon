/ Food color database
const foodColors = {
    'orange': ['mango', 'orange', 'carrot', 'pumpkin', 'sweet potato'],
    'red': ['apple', 'strawberry', 'tomato', 'cherry', 'red pepper'],
    'yellow': ['banana', 'lemon', 'corn', 'yellow pepper'],
    'green': ['lettuce', 'broccoli', 'green apple', 'cucumber', 'avocado'],
    'purple': ['eggplant', 'purple cabbage', 'plum', 'blackberry'],
    'brown': ['potato', 'mushroom', 'chocolate', 'coffee bean']
};

// Recipe database
const recipes = {
    'mango': [
        { name: 'Mango Smoothie', ingredients: ['mango', 'yogurt', 'honey', 'ice'] },
        { name: 'Mango Salsa', ingredients: ['mango', 'red onion', 'cilantro', 'lime juice'] },
        { name: 'Mango Sticky Rice', ingredients: ['mango', 'sticky rice', 'coconut milk', 'sugar'] }
    ],
    'orange': [
        { name: 'Orange Juice', ingredients: ['oranges'] },
        { name: 'Orange Chicken', ingredients: ['chicken', 'orange juice', 'soy sauce', 'ginger'] }
    ],
    'carrot': [
        { name: 'Carrot Soup', ingredients: ['carrots', 'onion', 'vegetable broth', 'cream'] },
        { name: 'Carrot Cake', ingredients: ['carrots', 'flour', 'sugar', 'eggs', 'cinnamon'] }
    ],
    'apple': [
        { name: 'Apple Pie', ingredients: ['apples', 'pie crust', 'sugar', 'cinnamon'] },
        { name: 'Apple Crumble', ingredients: ['apples', 'flour', 'butter', 'sugar', 'oats'] }
    ],
    'banana': [
        { name: 'Banana Bread', ingredients: ['bananas', 'flour', 'sugar', 'eggs', 'butter'] },
        { name: 'Banana Smoothie', ingredients: ['bananas', 'milk', 'honey', 'ice'] }
    ],
    'lettuce': [
        { name: 'Caesar Salad', ingredients: ['lettuce', 'croutons', 'parmesan', 'caesar dressing'] },
        { name: 'Garden Salad', ingredients: ['lettuce', 'tomatoes', 'cucumbers', 'carrots', 'dressing'] }
    ]
};

// Get DOM elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const cameraBtn = document.getElementById('camera-btn');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const cameraModal = document.getElementById('camera-modal');
const closeModal = document.querySelector('.close-modal');
const detectedFood = document.getElementById('detected-food');
const recipesContainer = document.getElementById('recipes');

// Camera stream
let stream = null;

// Open camera modal
cameraBtn.addEventListener('click', () => {
    cameraModal.style.display = 'block';
    startCamera();
});

// Close camera modal
closeModal.addEventListener('click', () => {
    cameraModal.style.display = 'none';
    stopCamera();
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === cameraModal) {
        cameraModal.style.display = 'none';
        stopCamera();
    }
});

// Start camera
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Could not access camera. Please make sure you have granted camera permissions.');
    }
}

// Stop camera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
}

// Capture image
captureBtn.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
   
    // Get the dominant color from the captured image
    const color = getDominantColor(canvas);
   
    // Convert RGB to color name
    const colorName = rgbToColorName(color.r, color.g, color.b);
   
    // Get possible foods for the detected color
    const possibleFoods = foodColors[colorName] || [];
   
    if (possibleFoods.length > 0) {
        const detectedFoodItem = possibleFoods[0]; // For simplicity, take the first match
        detectedFood.textContent = detectedFoodItem;
        displayRecipes(detectedFoodItem);
    } else {
        detectedFood.textContent = 'No food detected';
        recipesContainer.innerHTML = '';
    }
   
    // Close modal after capture
    cameraModal.style.display = 'none';
    stopCamera();
});

// Search functionality
searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        // Check if the search term matches any food in our database
        let foundFood = null;
        for (const [color, foods] of Object.entries(foodColors)) {
            if (foods.includes(searchTerm)) {
                foundFood = searchTerm;
                break;
            }
        }
       
        if (foundFood) {
            detectedFood.textContent = foundFood;
            displayRecipes(foundFood);
        } else {
            detectedFood.textContent = 'No matching food found';
            recipesContainer.innerHTML = '';
        }
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Get dominant color from image
function getDominantColor(canvas) {
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
   
    let r = 0, g = 0, b = 0;
    let count = 0;
   
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }
   
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
   
    return { r, g, b };
}

// Convert RGB values to color name
function rgbToColorName(r, g, b) {
    const colors = {
        'orange': { r: 255, g: 165, b: 0 },
        'red': { r: 255, g: 0, b: 0 },
        'yellow': { r: 255, g: 255, b: 0 },
        'green': { r: 0, g: 128, b: 0 },
        'purple': { r: 128, g: 0, b: 128 },
        'brown': { r: 165, g: 42, b: 42 }
    };

    let closestColor = '';
    let minDistance = Infinity;

    for (const [color, rgb] of Object.entries(colors)) {
        const distance = Math.sqrt(
            Math.pow(r - rgb.r, 2) +
            Math.pow(g - rgb.g, 2) +
            Math.pow(b - rgb.b, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestColor = color;
        }
    }

    return closestColor;
}

// Display recipes for the detected food
function displayRecipes(food) {
    const foodRecipes = recipes[food] || [];
    recipesContainer.innerHTML = '';

    if (foodRecipes.length === 0) {
        recipesContainer.innerHTML = '<p>No recipes found for this food item.</p>';
        return;
    }

    foodRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <h3>${recipe.name}</h3>
            <p>Ingredients: ${recipe.ingredients.join(', ')}</p>
        `;
        recipesContainer.appendChild(recipeCard);
    });
}