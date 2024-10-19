class BookmarkView {
    #data
    #parentElement = document.querySelector('.header__bookmark-items__lists');

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }

    #generateMarkup() {
        return `
            
         ${this.#data.map(bookmark => `
            <a href='#${bookmark.id}'>
            <li>
            <div><img src="${bookmark.image}"></div>
            <p>${bookmark.title}</p>
            </li>
            </a>
            `
        ).join("")}   
        `


    }

    render(data) {
        this.#parentElement.innerHTML = "";
        this.#data = data;
        const markup = this.#generateMarkup()
        this.#parentElement.insertAdjacentHTML('afterbegin', markup);
    }



}
export default new BookmarkView();