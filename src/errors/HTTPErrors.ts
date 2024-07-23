export interface ErrorCodeData {
    UnknownError: {},
    MissingPermissions: {
        bitfield: number,
        bitfieldString: string[]
    },
    InvalidBody: {
        errors: { message: string, at: string }[],
    }
}

export interface HTTPErrorDetails<T extends keyof ErrorCodeData> {
    httpStatus: number,
    underlyingError: Error,
    error: {
        message: string,
        code: T,
        at?: string,
        data: ErrorCodeData[T],
    }
}

export default class HTTPError<T extends keyof ErrorCodeData> extends Error {
    /**
     * The HTTP status code of the error
     */
    public status: number;

    /**
     * Where the server has told you where the error is at
     */
    public at?: string;

    /**
     * The potential data the server has provided to help you diagnose the error
     */
    public data: ErrorCodeData[T];

    /**
     * The server error code
     */
    public code: T;

    /**
     * The underlying axios error object
     */
    public underlyingError: Error;

    constructor(data: HTTPErrorDetails<T>) {
        super(data.error.message);
        this.status = data.httpStatus;
        this.at = data.error.at;
        this.code = data.error.code;
        this.data = data.error.data;
        this.underlyingError = data.underlyingError;
    }

    public getData<K extends keyof ErrorCodeData>(): ErrorCodeData[K] {
        return this.data as ErrorCodeData[K];
    }
}