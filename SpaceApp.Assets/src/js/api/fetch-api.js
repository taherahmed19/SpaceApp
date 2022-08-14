import { applicationEndpoints } from './api-endpoints';

class Api {
    constructor() {
        this.endpoints = applicationEndpoints;
    }

    makeApiCall(method = "", callback, params = {}, body = {}) {
        const endpoint = this.endpoints[method];
        if (endpoint) {
            const apiCall = endpoint(params, body);
            return this.request(apiCall, callback);
        }
    };

    async request(endpoint = {}, callback = () => { }) {
        try {
            if (endpoint) {
                let url = `${endpoint.resource}${endpoint.method == "GET" && endpoint.params ? '?' + (new URLSearchParams(endpoint.params)).toString() : ''}`;

                fetch(url, {
                    'method': endpoint.method,
                    'body': endpoint.body ? JSON.stringify(endpoint.body) : null,
                    'accept': endpoint.accept,
                    'content-type': endpoint.contentType ? endpoint.contentType : null,
                }).then(async (response) => {
                    const data = await response.json();
                    callback(data);
                    return data;
                }).catch((error) => {
                    console.error(error)
                    return error;
                });
            }
        } catch (error) {
            console.error(error)
            return error;
        }
    };
}

export default new Api();