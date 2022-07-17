import './../css/admin.css'
import ExcursionsAPI from './ExcursionsAPI'
import ExcursionsLoader from './ExcursionsLoader'

const api = new ExcursionsAPI('http://localhost:3000/excursions')

const init = () => {
    load()
    add()
}

document.addEventListener('DOMContentLoaded', init)

const load = () => {
    api.loadData()
        .then(data => insert(data))
        .catch(error => console.log("error", error))
}

const insert = (excursionsList) => {
    const excursionsPanelEl = findExcursionsPanel()
    const excursionPrototypeEl = excursionsPanelEl.querySelector('.excursions__item--prototype')
    const loader = new ExcursionsLoader(excursionsPanelEl, excursionsList, excursionPrototypeEl)
    loader.init()
}

const add = () => {
    const formEl = document.querySelector('.form')

    formEl.addEventListener('submit', (e) => {
        e.preventDefault()
        const data = getFormData(e.target)

        api.addData(data)
            .catch(error => console.log("error", error))
            .finally(() => load())
    })
}



const findExcursionsPanel = () => {
    return document.querySelector('.panel__excursions')
}

const getFormData = (form) => {
    const formElements = form.elements
    const { title, description, adultPrice, childrenPrice } = formElements
    return {
        title: title.value,
        description: description.value,
        adultPrice: adultPrice.value,
        childrenPrice: childrenPrice.value
    }
}
