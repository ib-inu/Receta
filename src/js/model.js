import { API_URL, KEY } from "./config.js";
import { getJSON, sendJSON } from "./helper.js";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
    },
    bookmarks: [],
}

const createRecipeObject = function (data) {
    const { recipe } = data;

    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    };

}

export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}/${id}`);
        state.recipe = createRecipeObject(data);
        if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

    } catch (e) {
        throw e;

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
        // console.log(e);
        throw e;

    }
}


const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}



export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);

    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}

export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1)

    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
}

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) {
        state.bookmarks = JSON.parse(storage); // Assuming model.bookmarks exists
    }
};
init();


export const uploadRecipe = async function (newRecipe) {
    try {

        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== "").map(ing => {
            const ingArr = ing[1].replaceAll(" ", '').split(',');
            if (ingArr.length !== 3) throw new Error("Wrong Ingredient Format! Please use the correct format..")
            const [quantity, unit, description] = ingArr;
            return { quantity: quantity ? +quantity : null, unit, description };
        });



        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        }

        const data = await sendJSON(`${API_URL}/?key=${KEY}`, recipe);
        state.recipe = createRecipeObject(data.data);
        addBookmark(state.recipe);
    } catch (e) {
        throw e;
    }

}