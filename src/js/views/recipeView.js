class RecipeView {
  #parentElement = document.querySelector(".container");
  #data

  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup()
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);

  }
  addHandlerRender(handler) {
    window.addEventListener('hashchange', handler);

  }
  renderLoader() {
    const markup = `
    <div class="spinner-div">
        <span class="spinner-div__loader"></span>
    </div>
    `;
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  removeLoader() {
    const loader = document.querySelector('.spinner-div');
    if (loader) loader.remove();
  }

  renderError(message) {
    const markup = `
      <div class="error">
        <p class="error__message">${message}</p>
      </div>
`
    this.#clear();
    this.#parentElement.insertAdjacentHTML("afterend", markup)
  }

  addHandlerAddBookmark(handler) {
    this.#parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.recipe-details__bookmark');
      if (!btn) return;
      handler();
    });
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this.#data = data;
    const newMarkup = this.#generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this.#parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (!newEl.isEqualNode(curEl) && newEl.firstChild.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value))
      }

    })
  }

  #clear() {
    this.#parentElement.innerHTML = "";
  }

  #generateMarkup() {
    console.log(this.#data);

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
              <button class="recipe-details__bookmark">${this.#data.bookmarked ? "Bookmarked" : "Bookmark"}</button>
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