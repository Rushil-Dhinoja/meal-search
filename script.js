const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultText = document.getElementById('result-heading'),
    single_mealEL = document.getElementById('single-meal');

// Functions
async function searchMeal(e) {
    e.preventDefault();

    single_mealEL.innerHTML = '';

    const term = search.value;

    if (term.trim()) {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const data = await res.json();
        resultText.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.meals === null) {
            resultText.innerHTML = `<p>There are no search results. Try Again</p>`;
        } else {
            mealsEl.innerHTML = data.meals
                .map(
                    (meal) => ` <div class='meal' >
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class='meal-info' data-mealID='${meal.idMeal}'>
                    <h3>${meal.strMeal}</h3>
                </div>
            </div> `
                )
                .join('');
        }

        search.value = '';
    } else {
        alert('Please enter a search term');
    }
}

async function getMealById(mealID) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    const data = await res.json();
    const meal = data.meals[0];

    addMealToDOM(meal);
}

async function randomMeal() {
    mealsEl.innerHTML = '';
    resultText.innerHTML = ' ';

    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data = await res.json();

    addMealToDOM(data.meals[0]);
}

function addMealToDOM(meal) {
    const ingrediants = [];

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingrediants.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    single_mealEL.innerHTML = `
        <div class='single-meal' >
            <h1>${meal.strMeal}</h1>
            <img src='${meal.strMealThumb}' alt='${meal.strMeal}' />
            <div class='single-meal-info' > 
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class='main' >
                <p>${meal.strInstructions}</p>
            </div>
            <ul>
                ${ingrediants.map((ing) => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', randomMeal);

mealsEl.addEventListener('click', (e) => {
    const mealInfo = e.path.find((item) => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealById(mealID);
    }
});
