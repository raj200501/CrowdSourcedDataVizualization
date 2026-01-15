const { AppError } = require('./errors');

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const isPlainObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

const validateDatasetPayload = (payload) => {
    const errors = [];
    if (!payload || !isPlainObject(payload)) {
        throw new AppError('Invalid dataset payload', 400, 'Payload must be an object.');
    }
    if (!isNonEmptyString(payload.name)) {
        errors.push('name is required');
    }
    if (!Array.isArray(payload.data)) {
        errors.push('data must be an array');
    }
    if (!isNonEmptyString(payload.uploadedBy)) {
        errors.push('uploadedBy is required');
    }
    if (payload.tags && !Array.isArray(payload.tags)) {
        errors.push('tags must be an array of strings');
    }
    if (errors.length > 0) {
        throw new AppError(`Invalid dataset payload: ${errors.join(', ')}`, 400, 'Dataset payload validation failed.');
    }
};

const validateAnnotationPayload = (payload) => {
    if (!payload || !isPlainObject(payload)) {
        throw new AppError('Invalid annotation payload', 400, 'Payload must be an object.');
    }
    if (!isNonEmptyString(payload.author)) {
        throw new AppError('Annotation author required', 400, 'Annotation author is required.');
    }
    if (!isNonEmptyString(payload.message)) {
        throw new AppError('Annotation message required', 400, 'Annotation message is required.');
    }
};

const validateUserPayload = (payload) => {
    if (!payload || !isPlainObject(payload)) {
        throw new AppError('Invalid user payload', 400, 'Payload must be an object.');
    }
    if (!isNonEmptyString(payload.username)) {
        throw new AppError('Username required', 400, 'Username is required.');
    }
    if (!isNonEmptyString(payload.password)) {
        throw new AppError('Password required', 400, 'Password is required.');
    }
    if (!isNonEmptyString(payload.email)) {
        throw new AppError('Email required', 400, 'Email is required.');
    }
    if (!payload.email.includes('@')) {
        throw new AppError('Invalid email', 400, 'Email must be valid.');
    }
};

module.exports = {
    isNonEmptyString,
    isPlainObject,
    validateDatasetPayload,
    validateAnnotationPayload,
    validateUserPayload,
};
