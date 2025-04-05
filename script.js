function displayRecipeDetails(recipe) {
    const recipeDetails = document.getElementById('recipe-details');
    recipeDetails.innerHTML = `
        <div class="recipe-header">
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            <h1>${recipe.title}</h1>
        </div>
        <div class="recipe-content">
            <div class="recipe-meta">
                <div class="recipe-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${recipe.readyInMinutes} minutes</span>
                </div>
                <div class="recipe-meta-item">
                    <i class="fas fa-utensils"></i>
                    <span>${recipe.servings} servings</span>
                </div>
                <div class="recipe-meta-item">
                    <i class="fas fa-fire"></i>
                    <span>${recipe.calories} calories</span>
                </div>
            </div>
            <div class="recipe-summary">
                <h2>Description</h2>
                <p>${capitalizeFirstLetter(recipe.summary)}</p>
            </div>
            <div class="recipe-section">
                <h2>Ingredients</h2>
                <ul class="ingredients-list">
                    ${recipe.extendedIngredients.map(ingredient => `
                        <li class="ingredient-item">
                            <i class="fas fa-check"></i>
                            <span>${capitalizeFirstLetter(ingredient.original)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="recipe-section">
                <h2>Instructions</h2>
                <ol class="instructions-list">
                    ${recipe.analyzedInstructions[0].steps.map(step => `
                        <li class="instruction-item">
                            ${capitalizeFirstLetter(step.step)}
                        </li>
                    `).join('')}
                </ol>
            </div>
            <div class="recipe-section">
                <h2>Nutrition Information</h2>
                <div class="nutrition-info">
                    ${Object.entries(recipe.nutrition.nutrients).map(([key, value]) => `
                        <div class="nutrition-item">
                            <h4>${capitalizeFirstLetter(key)}</h4>
                            <p>${value.amount} ${value.unit}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="origin-info">
                <h3>Recipe Origin</h3>
                <p>${capitalizeFirstLetter(recipe.cuisines.join(', '))}</p>
                <a href="flight-booking.html" class="book-flight-btn">
                    Book a Flight to Try This Recipe
                    <i class="fas fa-plane"></i>
                </a>
            </div>
        </div>
    `;
}

function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function displayRecipes(recipes) {
    const recipeGrid = document.getElementById('recipe-grid');
    recipeGrid.innerHTML = recipes.map(recipe => `
        <div class="food-card" onclick="window.location.href='recipe-details.html?id=${recipe.id}'">
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="food-info">
                <h3>${recipe.title}</h3>
                <p>${capitalizeFirstLetter(recipe.summary.substring(0, 100))}...</p>
                <div class="time">
                    <i class="fas fa-clock"></i>
                    <span>${recipe.readyInMinutes} minutes</span>
                </div>
            </div>
        </div>
    `).join('');
} 