const {LUNAR_TO_ASTRONOMICAL_RATIO, MANDATORY, MANDATORY_WITH_DATA, EXTENDED_WITH_DATA, responseToQueryParametersMap, responseMandatoryFieldsList, LUNAR_UNITS} = require('./constants.js');
const _ = require('lodash');
const {expect} = require('chai');


class APIUtilities {
   
    /**
     * Returns the expected schema, without the "data" parameter, for the given option
     * - Only mandatory (when result is no record found)
     * - Only mandatory data records fields (certain queries do use this option)
     * - Optional data records fields: TODO conditional fields depending on the query 
     * @param {object} mandatorySchema: schema with the mandatory fields
     * @param {string} option: Key for updating the mandatory schema with the extended desired fields. 
     * Supported Values: "mandatory", "mandatory with data", "extended with data"
    */
    getExpectedResponse(mandatorySchema, option) {

        const expectedResponse = _.cloneDeep(mandatorySchema);

        switch(option) {
            case MANDATORY_WITH_DATA:
                expectedResponse.fields = responseMandatoryFieldsList;
            case MANDATORY:
                break;
            case EXTENDED_WITH_DATA:
                console.log("Not implemented yet");
            default:
                throw new Error(`Not supported option "${option}"`);                
        };

        return expectedResponse;
    }

    /**
     * Returns the expected value that assertions should use. It depends on the query parameter nature
     * @param {string} field: query parameter name. 
     * TODO: Complete the framework with all documented fields
     * @param {string} value: query parameter value that was sent in the request. It should be transformed somehow
     * @returns {*} transformed value
    */
    getExpectedValue(field, value) {
        switch(field) {
            case 'dist-min':
            case 'dist-max':
                const base = value.slice(-2) === LUNAR_UNITS ? parseFloat(value.slice(0, -2)) : parseFloat(value);
                return value.slice(-2) === LUNAR_UNITS ? base * LUNAR_TO_ASTRONOMICAL_RATIO : base;
            case 'date-min':
            case 'date-max':
                    return new Date(value);
            default:
                throw new Error(`Not supported option "${field}"`);   
        }
    }

    /**
     * Validates response schema. When response includes data records, it validates the first record length
     * @param {string} option: key for how to validate response. 
     * Supported values: "mandatory", "mandatory with data", "extended with data"
     * @param {Object} apiResponse: actual api response
     * @param {Object} expectedResponse: expected response without the data records
    */
     validateResponseSchema(option, apiResponse, expectedResponse) {
        const clonedApiResponse = _.cloneDeep(apiResponse);
        if (option === MANDATORY) {
            expect(apiResponse).to.eql(expectedResponse);
        } else {
            delete clonedApiResponse.data
            expect(clonedApiResponse).to.eql(expectedResponse);
            expect(apiResponse.data).to.be.an('array');
            expect(apiResponse.data[0]).to.be.an('array');
            expect(apiResponse.data[0]).to.have.lengthOf(expectedResponse.fields.length);
        }
    }

    /**
     * Validates every response record by using input query parameters constraints. The field in the record is determined 
     * by its array index. The operator is a customized key that is configured for each query paramenter. 
     * The expected value is got from a dedicated formula for each parameter. The actual value is transformed appropiately
     * following operator rules before performing the validation
     * @param {array} record: response data record
    */
    validateResponseRecordValues(record) {
        for (const queryParameter of Object.keys(global.queryParameters)) {
            const arrayIndex = global.response.data.fields.indexOf(
                responseToQueryParametersMap[queryParameter].responseField
            );
            const expectedValue = global.apiUtilities.getExpectedValue(
                queryParameter, 
                global.queryParameters[queryParameter]
            );
            const errorMessage = `\nQuery Parameter: ${queryParameter}, `+ 
                `Operator: ${responseToQueryParametersMap[queryParameter].eval}, ` +
                `response field: ${responseToQueryParametersMap[queryParameter].responseField}, ` +
                `array index: ${arrayIndex}\n` +
                `Whole record: ${record}`;
            
            switch (responseToQueryParametersMap[queryParameter].eval) {
                case 'LESS_OR_EQUAL_THAN':
                    expect(parseFloat(record[arrayIndex])).to.not.be.above(expectedValue, errorMessage);
                    break;
                case 'MORE_OR_EQUAL_THAN':
                    expect(parseFloat(record[arrayIndex])).to.not.be.below(expectedValue, errorMessage);
                    break;
                case 'DATE_LESS_OR_EQUAL_THAN':
                    // HEADS UP: "expect" library does not understand 'YYYY-MMM-DD' dates (i.e. '2020-Jan-01') as being on UTC time. 
                    // a 'Z' is needed for comparison to work
                    expect(new Date(`${record[arrayIndex]}Z`)).to.not.be.above(expectedValue, errorMessage);
                    break;
                case 'DATE_MORE_OR_EQUAL_THAN':
                    // HEADS UP: "expect" library does not understand 'YYYY-MMM-DD' dates (i.e. '2020-Jan-01') as being on UTC time. 
                    // a 'Z' is needed for comparison to work
                    expect(new Date(`${record[arrayIndex]}Z`)).to.not.be.below(expectedValue, errorMessage);
                    break;
                case 'EQUAL':
                    expect(record[arrayIndex]).to.equal(expectedValue, errorMessage);
                    break;
                default:
                    throw new Error(`Not supported option "${operator}"`); 
            }
        }
    }
    
};

module.exports = APIUtilities;