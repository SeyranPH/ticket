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

export class ForbiddenError extends HTTPError {
    constructor(message: string) {
        super(403, message);
    }
}

export class ConflictError extends HTTPError {
    constructor(message: string) {
        super(409, message);
    }
}