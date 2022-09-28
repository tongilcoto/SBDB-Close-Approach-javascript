const apiRequests = require('./src/apiRequests.js');
global.apiRequests = new apiRequests();

const apiUtilities = require('./src/apiUtilities.js');
global.apiUtilities = new apiUtilities();
