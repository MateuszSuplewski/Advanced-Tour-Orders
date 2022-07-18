class ExcursionsAPI {
    constructor(API_URL) {
        this.API_URL = API_URL
    }

    loadData(dataPath) {
        return this._fetch(dataPath)
    }

    addData(data, dataPath) {
        const options = { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }
        return this._fetch(dataPath, options)
    }

    removeData(id, dataPath) {
        const options = { method: 'DELETE' }
        return this._fetch(dataPath, options, `/${id}`)
    }

    updateData(id, data, dataPath) {
        const options = { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }
        return this._fetch(dataPath, options, `/${id}`)
    }

    _fetch(dataPath = 'excursions', options, additionalPath = '') {
        const url = `${this.API_URL}/${dataPath}${additionalPath}`
        return fetch(url, options)
            .then(response => {
                if (response.ok) return response.json()
                return Promise.reject(response)
            })
    }
}

export default ExcursionsAPI;