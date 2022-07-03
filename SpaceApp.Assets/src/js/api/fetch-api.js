import { applicationEndpoints } from './api-endpoints';

class Api {
    constructor() {
        this.endpoints = applicationEndpoints;
    }

    makeApiCall(method = "", callback) {
        const endpoint = this.endpoints[method];
        if (endpoint) {
            const apiCall = endpoint();
            return this.request(apiCall, callback);
        }
    };

    async request(endpoint = {}, callback = () => { }) {
        try {
            const response = await fetch(endpoint?.resource, {
                'method': endpoint?.method,
                'body': endpoint?.body ? JSON.stringify(endpoint.body) : null,
                'accept': endpoint?.accept,
                'content-type': endpoint?.contentType ? endpoint.contentType : null,
            });
            
            const data = await response.json();

            callback(data);
            
            return await data;
        } catch (error) {
            console.error(error)
            return error;
        }
    };
}

export default new Api();