const axios = require('axios');
const {baseURL, API_TIMEOUT} = require('./constants.js');


class APIRequests {
    
    /**
     * Creates variable for holding the request context
    */
    setAPI() {
        this.api = axios.create({
            baseURL,
            method: 'get',
            timeout: API_TIMEOUT,
            validateStatus: false
        });
    }

    /**
     * Performs the request as it is defined in the request context variable. 
     * @param {object} params: Desired request query parameters
    */
    async get(params) {
        return await this.api.request({params});
    }

};

module.exports = APIRequests;