export const state = {
    recipe: {},
}

export const loadRecipe = async function (id) {
    try {
        const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
        if (!res.ok) throw new Error(res.status)
        const { status, data } = await res.json();

        if (status !== "success") throw new Error("Invalid id");

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

        console.log(state.recipe);

    } catch (e) {
        console.log(e);

    }
} 