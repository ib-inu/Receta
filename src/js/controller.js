import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

const bookmarks = document.querySelector(".header__bookmark-title");
const bookmarkList = document.querySelector(".header__bookmark-items");
const searchForm = document.querySelector(".header__search");
const searchInput = document.querySelector(".header__search-bar");
const addRecipeBtn = document.querySelector(".add-recipe__icon");
const addRecipeForm = document.querySelector(".add-recipe__form");
const recipeList = document.querySelector(".recipe-items");


addRecipeBtn.addEventListener('click', () => {
    addRecipeForm.classList.toggle("open")
    recipeList.classList.toggle("close")
})

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputValue = searchInput.value;
    if (inputValue.length < 2) return;
    controlSearchResults(inputValue);

});

bookmarks.addEventListener('click', () => {
    bookmarkList.classList.toggle("open");
})

const controlSearchResults = async (query) => {
    recipeView.renderLoader();
    try {
        const recipe = await model.loadSearchResults(query);
        if (!recipe) throw new Error("Invalid search query");

        searchView.render(recipe);

    } catch (e) {
        recipeView.renderError(e);
    } finally {
        recipeView.removeLoader();
    }
}

async function getRecipeController() {
    try {
        recipeView.renderLoader();
        const id = window.location.hash.slice(1);

        //loading recipe
        await model.loadRecipe(id);

        //rendering recipe
        recipeView.render(model.state.recipe);

        // Add event listener to the overlay for closing modal
        const recipeDetail = document.querySelector('.recipe-details');
        const overlay = document.querySelector('.recipe-details__overlay');

        overlay.addEventListener('click', () => {
            recipeDetail.remove();
            history.pushState("", document.title, window.location.pathname);
        });

    } catch (e) {
        console.log(e);
    } finally {
        recipeView.removeLoader()
    }
}

recipeView.addHandlerRender(getRecipeController);

const controlAddBookmark = function () {
    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
    else model.deleteBookmark(model.state.recipe.id);

    recipeView.update(model.state.recipe)
}

recipeView.addHandlerAddBookmark(controlAddBookmark);