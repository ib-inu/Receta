import { API_URL } from "./config.js";
import { getJSON } from "./helper.js";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
    },
    bookmarks: [],
}

export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}/${id}`);

        const { recipe } = data;

        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
        }

    } catch (e) {
        console.log(e);

    }
}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`);
        state.search.results = data.recipes.map(r => {
            return {
                id: r.id,
                title: r.title,
                publisher: r.publisher,
                image: r.image_url
            }
        })
        return state.search.results;
    } catch (e) {
        console.log(e);
        throw e;

    }
}


export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);

    if (recipe.id === state.recipe.id) state.recipe.bookmarks = true;
}