class SearchView {
    #parentElement = document.querySelector(".recipe-container");
    #data


    render(data) {
        this.#data = data;
        const markup = this.#generateMarkup()
        this.#parentElement.innerHTML = "";
        this.#parentElement.insertAdjacentHTML('beforeend', markup);

    }

    #generateMarkup() {
        return `
<div class="recipe-items">
${this.#data.map(item => `
    <a href='#${item.id}' >
    <div class="recipe-items__card">
    <div class="recipe-items__card-img">
    <img
    class="recipe-items__img"
    src=${item.image}
    alt="Pizza image"
    />
    </div>
    <div class="recipe-items__card-info">
    <h3 class="recipe-items__foodname">${item.title}</h3>
    <p class="recipe-items__description">${item.publisher}</p>
    </div>
    </div>
    </a >
    `).join('')}
</div>
`;


    }
}

export default new SearchView();
