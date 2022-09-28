const {Before} = require('@cucumber/cucumber');

Before( function() {
    global.apiRequests.setAPI();
});