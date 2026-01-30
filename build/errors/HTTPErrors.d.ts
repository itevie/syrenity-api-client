export interface ErrorCodeData {
    UnknownError: {};
    MissingPermissions: {
        bitfield: number;
        bitfieldString: string[];
    };
    InvalidBody: {
        errors: {
            message: string;
            at: string;
        }[];
    };
}
export interface HTTPErrorDetails<T extends keyof ErrorCodeData> {
    httpStatus: number;
    underlyingError: Error;
    error: {
        message: string;
        code: T;
        at?: string;
        data: ErrorCodeData[T];
    };
}
export default class HTTPError<T extends keyof ErrorCodeData> extends Error {
    /**
     * The HTTP status code of the error
     */
    status: number;
    /**
     * Where the server has told you where the error is at
     */
    at?: string;
    /**
     * The potential data the server has provided to help you diagnose the error
     */
    data: ErrorCodeData[T];
    /**
     * The server error code
     */
    code: T;
    /**
     * The underlying axios error object
     */
    underlyingError: Error;
    constructor(data: HTTPErrorDetails<T>);
    getData<K extends keyof ErrorCodeData>(): ErrorCodeData[K];
}
//# sourceMappingURL=HTTPErrors.d.ts.map