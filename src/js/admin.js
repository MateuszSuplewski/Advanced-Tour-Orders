import './../css/admin.css'
import ExcursionsAPI from './ExcursionsAPI'
import ExcursionsLoader from './ExcursionsLoader'

const api = new ExcursionsAPI('http://localhost:3000')

const init = () => {
    load()
    add()
    remove()
    update()
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
        clearForm(e.target)
        api.addData(data)
            .catch(error => console.log("error", error))
            .finally(() => load())
    })
}

const remove = () => {
    const panelEl = findExcursionsPanel()

    panelEl.addEventListener('click', (e) => {
        e.preventDefault()

        if (isElementContainingClass(e.target, 'excursions__field-input--remove')) {
            const excursionEl = e.target.parentElement.parentElement.parentElement
            const id = excursionEl.dataset.id

            api.removeData(id)
                .catch(error => console.log("error", error))
                .finally(() => load())
        }
    })
}

const update = () => {
    const panelEl = findExcursionsPanel()

    panelEl.addEventListener('click', (e) => {
        e.preventDefault()

        if (isElementContainingClass(e.target, 'excursions__field-input--update')) {
            const excursionEl = e.target.parentElement.parentElement.parentElement
            const elListInsideExcursion = findElementsInsideExcursion(excursionEl)
            const isEditable = [...elListInsideExcursion].every(element => element.isContentEditable)

            if (isEditable) {
                const id = excursionEl.dataset.id
                const data = getExcursionData(elListInsideExcursion)

                api.updateData(id, data)
                    .catch(error => console.log("error", error))
                    .finally(() => {
                        e.target.value = 'edytuj'
                        elListInsideExcursion.forEach(element => element.contentEditable = false)
                    })
            }
            else {
                e.target.value = 'zapisz'
                elListInsideExcursion.forEach(element => element.contentEditable = true)
            }
        }
    })
}

const isElementContainingClass = (element, className) => {
    return element.classList.contains(className)
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

const getExcursionData = (elements) => {
    const [title, description, adultPrice, childrenPrice] = elements
    return {
        title: title.innerText,
        description: description.innerText,
        adultPrice: adultPrice.innerText,
        childrenPrice: childrenPrice.innerText
    }
}

const findElementsInsideExcursion = (excursion) => {
    const titleEl = excursion.querySelector('.excursions__title')
    const descriptionEl = excursion.querySelector('.excursions__description')
    const pricesElList = excursion.querySelectorAll('.excursions__price')
    return [titleEl, descriptionEl, ...pricesElList]
}

const clearForm = (form) => {
    const { title, description, adultPrice, childrenPrice } = form.elements
    title.value = ''
    description.value = ''
    adultPrice.value = ''
    childrenPrice.value = ''
}
