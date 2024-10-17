import * as model from './model.js';
import recipeView from './views/recipeView.js';

const bookmarks = document.querySelector(".header__bookmark-title");
const bookmarkList = document.querySelector(".header__bookmark-items");
const searchForm = document.querySelector(".header__search");
const searchInput = document.querySelector(".header__search-bar");
const addRecipeBtn = document.querySelector(".add-recipe__icon");
const addRecipeForm = document.querySelector(".add-recipe__form");
const recipeList = document.querySelector(".recipe-items");
const itemCard = document.querySelector('.recipe-items__card');
const container = document.querySelector(".container");



addRecipeBtn.addEventListener('click', () => {
    addRecipeForm.classList.toggle("open")
    recipeList.classList.toggle("close")
})







searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = searchInput.value;
    if (inputValue.length < 2) return;
    getRecipeLists(inputValue);

});


bookmarks.addEventListener('click', () => {
    bookmarkList.classList.toggle("open");
})


const renderLoader = function (parentEl) {
    const markup = `
    <div class="spinner-div">
        <span class="spinner-div__loader"></span>
    </div>
    `;
    parentEl.insertAdjacentHTML("afterbegin", markup);
}

const removeLoader = function () {
    const loader = document.querySelector('.spinner-div');
    if (loader) loader.remove();
}

const getRecipeLists = async (query) => {
    renderLoader(container);
    const list = document.querySelector(".recipe-items");
    if (list) {
        list.remove();
    }

    try {
        const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`);
        if (!res.ok) throw new Error(`Something wrong with fetching API`);
        const { results, data } = await res.json();
        if (!results) throw new Error("Invalid search query");



        removeLoader();
        const markup = `
        <div class="recipe-items">
        ${data.recipes.map(item =>
            `
            <a href='#${item.id}' >
        <div class="recipe-items__card">
            <div class="recipe-items__card-img">
                <img
                    class="recipe-items__img"
                    src=${item.image_url}
                    alt="Pizza image"
                />
            </div>
            <div class="recipe-items__card-info">
                <h3 class="recipe-items__foodname">${item.title}</h3>
                <p class="recipe-items__description">${item.publisher}</p>
            </div>
        </div>
                </a >
    `
        ).join('')}
        </div>
        `;

        container.insertAdjacentHTML("beforeend", markup);

    } catch (e) {
        console.log(`Error: ${e}`);
        removeLoader();
    }
}



async function getRecipeController() {
    try {
        renderLoader(container);
        const id = window.location.hash.slice(1);

        //loading recipe
        await model.loadRecipe(id);


        //rendering recipe
        recipeView.render(model.state.recipe)

        // Add event listener to the overlay for closing modal
        const recipeDetail = document.querySelector('.recipe-details');
        const overlay = document.querySelector('.recipe-details__overlay');

        overlay.addEventListener('click', () => {
            recipeDetail.remove(); // Removes the recipe detail modal
            history.pushState("", document.title, window.location.pathname);
        });
        removeLoader()

    } catch (e) {
        console.log(e);
    }
}

// Listening for hash change to fetch the recipe
window.addEventListener('hashchange', getRecipeController);
