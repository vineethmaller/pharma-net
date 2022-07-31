'use strict';

function getErrorResponseObject(req, error) {
    let responseBody;
    
    let errorSlices = error.message.split('Error: ');
    // if(errorSlices.length >0) {
    //     responseBody = {
    //         status : 'error',
    //         source : 'common contract api',
    //         error : errorSlices[errorSlices.length - 1],
    //     };
    //     return responseBody;
    // }
        
    responseBody = {
        status : 'error',
        source : 'common contract api',
        error : error,
        request_body : req.body,
        request_headers : req.headers
    };
    
    return responseBody;
}

module.exports.getErrorResponseObject = getErrorResponseObject;