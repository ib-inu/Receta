import * as model from './model.js';
import bookmarksView from './views/bookmarksView.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import addRecipeView from './views/addRecipeView.js';

const bookmarks = document.querySelector(".header__bookmark-title");
const bookmarkList = document.querySelector(".header__bookmark-items");
const searchForm = document.querySelector(".header__search");
const searchInput = document.querySelector(".header__search-bar");

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
        if (!recipe.length) throw new Error("Invalid search query");

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

        await model.loadRecipe(id);

        recipeView.render(model.state.recipe);

        const recipeDetail = document.querySelector('.recipe-details');
        const overlay = document.querySelector('.recipe-details__overlay');

        overlay.addEventListener('click', () => {
            recipeDetail.remove();
            history.pushState("", document.title, window.location.pathname);
        });

    } catch (e) {
        recipeView.renderError(e);
    } finally {
        recipeView.removeLoader()
    }
}

recipeView.addHandlerRender(getRecipeController);


const controlBookmark = function () {
    bookmarksView.render(model.state.bookmarks);
}



const controlAddBookmark = function () {

    if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
    else model.deleteBookmark(model.state.recipe.id);

    recipeView.update(model.state.recipe)

    bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
    try {
        recipeView.renderLoader();
        await model.uploadRecipe(newRecipe);

        recipeView.render(model.state.recipe);
        const recipeDetail = document.querySelector('.recipe-details');
        const overlay = document.querySelector('.recipe-details__overlay');

        overlay.addEventListener('click', () => {
            recipeDetail.remove();
            history.pushState("", document.title, window.location.pathname);
        });

        setTimeout(function () {
            addRecipeView.closeForm()
        }, 2000)

    } catch (e) {
        recipeView.renderError(e);
    } finally {
        recipeView.removeLoader();
    }
}

recipeView.addHandlerAddBookmark(controlAddBookmark);
bookmarksView.addHandlerRender(controlBookmark);
addRecipeView.addHandlerUpload(controlAddRecipe);
