exports.baseURL = 'https://ssd-api.jpl.nasa.gov/cad.api';

exports.API_TIMEOUT = 60000;
exports.API_VERSION = '1.4';

exports.LUNAR = 'lunar';
exports.LUNAR_UNITS = 'LD';
exports.ASTRONOMICAL_TO_LUNAR_RATIO = 0.0025695686589742;

exports.MANDATORY = "mandatory";
exports.MANDATORY_WITH_DATA = "mandatory with data";
exports.EXTENDED_WITH_DATA = "extended with data";

exports.responseToQueryParametersMap = {
    'dist-max': {
        responseField: 'dist',
        eval: 'LESS_OR_EQUAL_THAN'
    },
    'date-min': {
        responseField: 'cd',
        eval: 'DATE_MORE_OR_EQUAL_THAN'
    }
}


// templates variables should exist in "global" object, i.e. global.apiVersion and global.responseCount
exports.responseMandatorySchema = () => `{
    "signature": {
        "source": "NASA/JPL SBDB Close Approach Data API",
        "version": "${apiVersion}"
    },
    "count": "${responseCount}"    
}`
exports.responseMandatoryFieldsList = ["des","orbit_id","jd","cd","dist","dist_min","dist_max","v_rel","v_inf","t_sigma_f","h"];
