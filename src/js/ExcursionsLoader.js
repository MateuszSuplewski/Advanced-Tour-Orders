class ExcursionsLoader {
    constructor(container, data, prototype) {
        this.container = container
        this.data = data;
        this.prototype = prototype
    }

    init() {
        this.clearPanel()
        this.data.forEach(data => this.createExcursionFromPrototype(data))
    }

    clearPanel() {
        this.container.innerHTML = ''
        this.container.appendChild(this.prototype)
    }


    createExcursionFromPrototype(data) {
        const excursion = this.prototype.cloneNode(true);
        excursion.classList.remove('excursions__item--prototype')

        const titleEl = excursion.querySelector('.excursions__title')
        const descriptionEl = excursion.querySelector('.excursions__description')
        const priceElements = excursion.querySelectorAll('.excursions__price')

        const { id, title, description, adultPrice, childrenPrice } = data
        const prices = [adultPrice, childrenPrice]

        excursion.dataset.id = id
        titleEl.innerText = title
        descriptionEl.innerText = description
        priceElements.forEach((priceEl, index) => priceEl.innerText = prices[index])

        this.container.appendChild(excursion);
    }

}

export default ExcursionsLoader;