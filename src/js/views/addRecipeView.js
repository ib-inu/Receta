class AddRecipeView {
    #parentElement = document.querySelector(".add-recipe__form");
    addRecipeForm = document.querySelector(".add-recipe__form");
    addRecipeBtn = document.querySelector(".add-recipe__icon");
    constructor() {

        this.addRecipeBtn.addEventListener('click', this.toggleForm.bind(this));
    }

    toggleForm() {
        this.addRecipeForm.classList.toggle("open");
    }
    closeForm() {
        this.addRecipeForm.classList.remove("open");
    }

    addHandlerUpload(handler) {
        this.#parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr)
            handler(data);
        })
    }
}

export default new AddRecipeView();