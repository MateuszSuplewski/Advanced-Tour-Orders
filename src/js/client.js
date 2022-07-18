import './../css/client.css'
import ExcursionsAPI from './ExcursionsAPI'
import ExcursionsLoader from './ExcursionsLoader'

const api = new ExcursionsAPI('http://localhost:3000')


const init = () => {
    load()
    addExcursionToCart()
    removeExcursionFromCart()
    submitExcursions()
}

document.addEventListener('DOMContentLoaded', init)

const load = () => {
    api.loadData()
        .then(data => insert(data))
        .catch(error => console.log("error", error))
}

const add = (order) => {
    const cartItemsElList = findCartItems()
    const { name, email, totalPrice } = order
    let details = []

    cartItemsElList.forEach((excursion) => {
        const orderedItem = getCartItemData(excursion)
        const { title, prices, totalPrice } = orderedItem
        details = details.concat(`${title}, ${totalPrice}, ${prices}`)
    })

    const data = { name, email, totalPrice, details }

    api.addData(data, 'orders')
        .catch(error => console.log("error", error))
        .finally(() => load())
}

const insert = (excursionsList) => {
    const excursionsPanelEl = findExcursionsPanel()
    const excursionPrototypeEl = excursionsPanelEl.querySelector('.excursions__item--prototype')

    const loader = new ExcursionsLoader(excursionsPanelEl, excursionsList, excursionPrototypeEl)
    loader.init()
}

const addExcursionToCart = () => {
    const excursionsPanelEl = findExcursionsPanel()

    excursionsPanelEl.addEventListener('submit', e => {
        e.preventDefault()

        const excursion = getExcursionData(e.target)
        const { adultsTickets, childrenTickets, adultsPrice, childrenPrice, title, pricesElList } = excursion
        const errors = checkExcursionValidation(adultsTickets, childrenTickets)

        if (errors.length === 0) {
            clearExcursionErrors(e.target)

            const cartEl = findCart()
            const cartItem = createCartItemFromPrototype(cartEl)
            const cartItemElList = findCartItemElements(cartItem)
            const { titleEl, pricesEl, totalPriceEl } = cartItemElList

            titleEl.innerText = title
            pricesEl.innerText = `dorośli: ${adultsTickets} x ${adultsPrice}PLN, dzieci: ${childrenTickets} x ${childrenPrice}PLN`
            totalPriceEl.innerText = calculateExcursionPrice(pricesElList, adultsTickets, childrenTickets)
            clearExcursionForm(e.target)
            updateTotalPrice()
        }
        else {
            showErrors(e.target, errors)
        }
    });
}


const removeExcursionFromCart = () => {
    const cartEl = findCart()

    cartEl.addEventListener('click', (e) => {
        e.preventDefault()
        if (isElementContainingClass(e.target, 'summary__btn-remove')) {

            const cartItem = e.target.parentElement.parentElement
            cartItem.remove()
            updateTotalPrice()
        }
    })
}

const submitExcursions = () => {
    const orderForm = findOrderForm()

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const order = getOrderData(e.target)
        const { name, email, totalPrice } = order
        const errors = checkOrderValidation(name, email)

        if (errors.length === 0) {
            alert(`Dziękujemy za złożenie zamówienia o wartości ${totalPrice}. Szczegóły zamówienia zostały wysłane na adres e-mail: ${email}`)
            add(order)
            clearOrderForm(e.target)
            clearCartItems()
            clearOrderFormErrors()
            load()
            updateTotalPrice()
        }
        else {
            showErrors(e.target, errors)
        }
    });
}

const updateTotalPrice = () => {
    const cartEl = findCart()
    const summaryPriceElList = Array.from(cartEl.querySelectorAll('.summary__total-price'))
    const totalPriceEl = document.querySelector('.order__total-price-value')

    const totalPrice = summaryPriceElList.reduce((value, priceEl) => {
        const price = priceEl.innerText
        return value + convertToNumber(price.replace('PLN', ''))
    }, 0)

    totalPriceEl.innerText = totalPrice + 'PLN'
}

const showErrors = (form, errors) => {
    let ul = form.querySelector('ul')
    if (!ul) {
        const newErrorList = document.createElement('ul')
        form.appendChild(newErrorList)
        ul = form.querySelector('ul')
    }

    ul.innerHTML = ''
    errors.forEach((error) => {
        const li = document.createElement('li')
        ul.appendChild(li)
        li.innerText = error
    })
}

const createCartItemFromPrototype = (panel) => {
    const prototype = panel.querySelector('.summary__item--prototype')
    const excursion = prototype.cloneNode(true)
    excursion.classList.remove('summary__item--prototype')
    panel.appendChild(excursion); // nowa wycieczka z prototypu stworzona stworzony
    return excursion
}

const calculateExcursionPrice = (priceElList, ...ticketElList) => {
    const totalPrice = ticketElList.reduce((value, ticket, index) => {
        return value + (convertToNumber(ticket) * convertToNumber(priceElList[index].innerText))
    }, 0)
    return `${totalPrice}PLN`
}

const clearOrderForm = (form) => {
    const formElements = form.elements
    const { name, email } = formElements
    name.value = ''
    email.value = ''
}

const clearExcursionForm = (form) => {
    const formElements = form.elements
    const { adults, children } = formElements
    adults.value = ''
    children.value = ''
}

const clearCartItems = () => {
    const cartItemsElList = findCartItems()
    cartItemsElList.forEach((item) => {
        item.remove()
    });
}

const clearOrderFormErrors = () => {
    const orderEl = findOrderForm()
    const errorList = orderEl.querySelector('ul')
    if (errorList) errorList.remove()
}

const clearExcursionErrors = (excursion) => {
    const errors = excursion.querySelectorAll('li')
    errors.forEach((error) => error.remove())
}

const checkExcursionValidation = (adults, children) => {
    const numberPattern = /^[0-9]{1,}$/
    let errors = []

    if (!adults.match(numberPattern)) errors = errors.concat('Wypełnij poprawnie pole bilety dla dorosłych')
    if (!children.match(numberPattern)) errors = errors.concat('Wypełnij poprawnie pole bilety dla dzieci')
    return errors
}

const checkOrderValidation = (name, email) => {
    let errors = []
    const nameAndLastNamePattern = /^[a-ząćęłńóśźż]{2,} [a-ząćęłńóśźż]{2,}$/i
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    if (!name.match(nameAndLastNamePattern)) errors = errors.concat('Wypełnij pole imie i nazwisko poprawnie')
    if (!email.match(emailPattern)) errors = errors.concat('Wprowadź poprawny adres email')
    return errors
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
        pricesElList: [adultsPriceEl, childrenPriceEl]
    }
}

const getOrderData = (orderEl) => {
    const totalPriceEl = orderEl.querySelector('.order__total-price-value')
    const { name, email } = orderEl.elements

    return {
        name: name.value,
        email: email.value,
        totalPrice: totalPriceEl.innerText
    }
}

const getCartItemData = (item) => {
    const cartItem = findCartItemElements(item)
    const { titleEl, pricesEl, totalPriceEl } = cartItem
    return {
        title: titleEl.innerText,
        prices: pricesEl.innerText,
        totalPrice: totalPriceEl.innerText
    }
}

const findCartItemElements = (cartItem) => {
    const titleEl = cartItem.querySelector('.summary__name')
    const pricesEl = cartItem.querySelector('.summary__prices')
    const totalPriceEl = cartItem.querySelector('.summary__total-price')
    return {
        titleEl,
        pricesEl,
        totalPriceEl
    }
}

const findCartItems = () => {
    return document.querySelectorAll('.summary__item:not(.summary__item--prototype)')
}

const findExcursionsPanel = () => {
    return document.querySelector('.panel__excursions')
}

const findCart = () => {
    return document.querySelector('.panel__summary')
}

const findOrderForm = () => {
    return document.querySelector('.order')
}

const convertToNumber = (value) => {
    return Number(value)
}

const isElementContainingClass = (element, className) => {
    return element.classList.contains(className)
}



