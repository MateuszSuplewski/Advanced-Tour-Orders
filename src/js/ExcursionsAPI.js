class ExcursionsAPI {
    constructor(API_URL) {
        this.API_URL = API_URL
    }

    loadData() {
        return this._fetch()
    }

    addData(data) {
        const options = { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }
        return this._fetch(options)
    }

    removeData(id) {
        const options = { method: 'DELETE' }
        return this._fetch(options, `/${id}`)
    }

    updateData(id, data) {
        const options = { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }
        return this._fetch(options, `/${id}`)
    }

    _fetch(options, additionalPath = '') {
        const url = `${this.API_URL}${additionalPath}`
        return fetch(url, options)
            .then(response => {
                if (response.ok) return response.json()
                return Promise.reject(response)
            })
    }
}

export default ExcursionsAPI;