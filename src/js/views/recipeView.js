class RecipeView {
    #parentElement = document.querySelector(".container");
    #data

    render(data) {
        this.#data = data;
        const markup = this.#generateMarkup()
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);


    }

    #generateMarkup() {
        return `
        <div class="recipe-details">
          <div class="recipe-details__overlay"></div>
          <div class="recipe-details__modal">
            <div class="recipe-details__img">
              <img
                class="recipe-details__img-element"
                src=${this.#data.image}
                alt="Recipe Image"
              />
            </div>
            
            <div class="recipe-details__name">
              <h1>${this.#data.title}</h1>
              <p>${this.#data.publisher}</p>
            </div>

            <div class="recipe-details__info">
              <span class="recipe-details__time">${this.#data.cookingTime} Minutes</span>
              <span class="recipe-details__servings">${this.#data.servings} Servings</span>
              <button class="recipe-details__bookmark">Bookmark</button>
            </div>

            <div class="recipe-details__ingredients">
              <h2>Ingredients</h2>
              <ul class="recipe-details__ingredients-list">
              ${this.#data.ingredients.map(ing => this.#generateMarkupIngredient(ing)).join("")}
              </ul>
            </div>
          </div>
        </div>
      `;

    }
    #generateMarkupIngredient(ing) {
        return `
        <li class="recipe-details__ingredient-item">
         ${ing.quantity ? `${ing.quantity}:` : ''} ${ing.description}
        </li>
    `
    }
}

export default new RecipeView();