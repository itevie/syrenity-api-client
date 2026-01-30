"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HTTPError extends Error {
    /**
     * The HTTP status code of the error
     */
    status;
    /**
     * Where the server has told you where the error is at
     */
    at;
    /**
     * The potential data the server has provided to help you diagnose the error
     */
    data;
    /**
     * The server error code
     */
    code;
    /**
     * The underlying axios error object
     */
    underlyingError;
    constructor(data) {
        super(data.error.message);
        this.status = data.httpStatus;
        this.at = data.error.at;
        this.code = data.error.code;
        this.data = data.error.data;
        this.underlyingError = data.underlyingError;
    }
    getData() {
        return this.data;
    }
}
exports.default = HTTPError;
