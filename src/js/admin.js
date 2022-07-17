import './../css/admin.css'
import ExcursionsAPI from './ExcursionsAPI'
import ExcursionsLoader from './ExcursionsLoader'

const api = new ExcursionsAPI('http://localhost:3000/excursions')

const init = () => {
    load()

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

const findExcursionsPanel = () => {
    return document.querySelector('.panel__excursions')
}

