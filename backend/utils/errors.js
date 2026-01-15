class AppError extends Error {
    constructor(message, statusCode = 500, publicMessage = 'Unexpected error') {
        super(message);
        this.statusCode = statusCode;
        this.publicMessage = publicMessage;
    }
}

module.exports = { AppError };
