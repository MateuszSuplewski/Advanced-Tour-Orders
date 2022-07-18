import './../css/client.css';
import ExcursionsAPI from './ExcursionsAPI';
import ExcursionsLoader from './ExcursionsLoader'

const api = new ExcursionsAPI('http://localhost:3000');


const init = () => {
    load()
    addExcursionToCart()
}

document.addEventListener('DOMContentLoaded', init);

const load = () => {
    api.loadData()
        .then(data => insert(data))
        .catch(error => console.log("error", error))
}

const insert = (excursionsList) => {
    const excursionsPanelEl = findExcursionsPanel()
    const excursionPrototypeEl = excursionsPanelEl.querySelector('.excursions__item--prototype')

    const loader = new ExcursionsLoader(excursionsPanelEl, excursionsList, excursionPrototypeEl)
    loader.init();

}


const addExcursionToCart = () => {
    const excursionsPanelEl = findExcursionsPanel()

    excursionsPanelEl.addEventListener('submit', e => {
        e.preventDefault()

        const excursion = getExcursionData(e.target)
        const { adultsTickets, childrenTickets, adultsPrice, childrenPrice, title, pricesEl } = excursion
        const errors = checkExcursionValidation(adultsTickets, childrenTickets)

        if (errors.length === 0) {
            clearExcursionErrors(e.target)

            const cartEl = findCart()
            const excursionSummaryEl = createCartItemFromPrototype(cartEl)
            const summaryItem = findCartItemElements(excursionSummaryEl)
            const { titleEl, priceEl, totalPriceEl } = summaryItem

            titleEl.innerText = title
            priceEl.innerText = `dorośli: ${adultsTickets} x ${adultsPrice}PLN, dzieci: ${childrenTickets} x ${childrenPrice}PLN`
            totalPriceEl.innerText = calculateExcursionPrice(pricesEl, adultsTickets, childrenTickets)
            updateTotalPrice()
        }
        else {
            showExcursionErrors(e.target, errors)
        }
    });
}

const findExcursionsPanel = () => {
    return document.querySelector('.panel__excursions')
}

const getExcursionData = (excursion) => {
    const { adults, children } = excursion.elements
    const [adultsPriceEl, childrenPriceEl] = excursion.querySelectorAll('.excursions__price')
    const titleEl = excursion.previousElementSibling.querySelector('.excursions__title')

    return {
        adultsTickets: adults.value,
        childrenTickets: children.value,
        title: titleEl.innerText,
        adultsPrice: adultsPriceEl.innerText,
        childrenPrice: childrenPriceEl.innerText,
        pricesEl: [adultsPriceEl, childrenPriceEl]
    }
}

const checkExcursionValidation = (adults, children) => {
    const numberPattern = /^[0-9]{1,}$/
    let errors = []

    if (!adults.match(numberPattern)) errors = errors.concat('Wypełnij poprawnie pole bilety dla dorosłych')
    if (!children.match(numberPattern)) errors = errors.concat('Wypełnij poprawnie pole bilety dla dzieci')
    return errors
}

const clearExcursionErrors = (excursion) => {
    const errors = excursion.querySelectorAll('li');
    errors.forEach((error) => error.remove())
}

const findCart = () => {
    return document.querySelector('.panel__summary')
}

const createCartItemFromPrototype = (panel) => {
    const prototype = panel.querySelector('.summary__item--prototype')
    const excursion = prototype.cloneNode(true);
    excursion.classList.remove('summary__item--prototype')
    panel.appendChild(excursion); // nowa wycieczka z prototypu stworzona stworzony
    return excursion
}

const findCartItemElements = (summary) => {
    const titleEl = summary.querySelector('.summary__name')
    const priceEl = summary.querySelector('.summary__prices')
    const totalPriceEl = summary.querySelector('.summary__total-price')
    return {
        titleEl,
        priceEl,
        totalPriceEl
    }
}

const calculateExcursionPrice = (priceElList, ...ticketElList) => {
    const totalPrice = ticketElList.reduce((value, ticket, index) => {
        return value + (convertToNumber(ticket) * convertToNumber(priceElList[index].innerText))
    }, 0);
    return `${totalPrice}PLN`
}

function updateTotalPrice() { // Clean
    const cartEl = findCart()
    const summaryPriceElList = Array.from(cartEl.querySelectorAll('.summary__total-price'))
    const totalPriceEl = document.querySelector('.order__total-price-value')

    const totalPrice = summaryPriceElList.reduce((value, priceEl) => {
        const price = priceEl.innerText
        return value + convertToNumber(price.replace('PLN', ''))
    }, 0);

    totalPriceEl.innerText = totalPrice + 'PLN'
}

const showExcursionErrors = (form, errors) => {
    let ul = form.querySelector('ul');
    if (!ul) {
        const newErrorList = document.createElement('ul')
        form.appendChild(newErrorList);
        ul = form.querySelector('ul');
    }

    ul.innerHTML = ''
    errors.forEach((error) => {
        const li = document.createElement('li')
        ul.appendChild(li);
        li.innerText = error
    })
}

const convertToNumber = (value) => {
    return Number(value)
}

