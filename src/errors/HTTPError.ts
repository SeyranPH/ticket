export class HTTPError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export class BadRequestError extends HTTPError {
    constructor(message: string) {
        super(400, message);
    }
}

export class NotFoundError extends HTTPError {
    constructor(message: string) {
        super(404, message);
    }
}
