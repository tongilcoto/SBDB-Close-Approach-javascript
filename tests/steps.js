const {Given, When, Then} = require('@cucumber/cucumber');
const {expect} = require('chai');
const _ = require('lodash');
const {API_VERSION, LUNAR, LUNAR_UNITS, responseMandatorySchema} = require('./src/constants.js') 

Given(/I want to know NEO close approaches data within "((([1-9]\d*)|0)(.0*[1-9](0*[1-9])*)?)" "(astronomical|lunar)" units since "(\d{4}-\d{2}-\d{2})"$/, function(distance, units, stringDate) {

    const unitsSymbol = units === LUNAR ? LUNAR_UNITS : '';

    // To Load query parameters 
    global.queryParameters = {
        'dist-max': distance + unitsSymbol,
        'date-min': stringDate
    };
});

When(/^I send the NASA's JPL API$/, {timeout: 100000}, async function() {
    // This step DOES NOT assert api response status

    // To Execute the request
    global.response = await global.apiRequests.get(global.queryParameters);
    // Variable for further assertion of "signature" response parameter
    global.apiVersion = API_VERSION;
});

Then(/^I receive an OK response with defined "(mandatory|mandatory with data|data extended)" response scheme$/, function(option) {
    expect(global.response.status).to.equal(200);
    global.responseCount = Object.keys(global.response.data).includes("data") ? global.response.data.data.length : 0;
    // HEADS UP: template literals only works implicitly when using global.<variable> variables.
    const expectedResponse = global.apiUtilities.getExpectedResponse(JSON.parse(responseMandatorySchema()), option);
    // Schema assertion
    global.apiUtilities.validateResponseSchema(option, global.response.data, expectedResponse);
});

Then(/^received data matches query conditions$/, function() {
    for (const record of global.response.data.data) {
        global.apiUtilities.validateResponseRecordValues(record);
    }
});