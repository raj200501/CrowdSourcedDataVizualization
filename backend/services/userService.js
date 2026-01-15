const { validateUserPayload } = require('../utils/validation');
const { hashPassword, verifyPassword } = require('../utils/password');
const { AppError } = require('../utils/errors');
const { createToken } = require('../utils/token');
const config = require('../config/config');

const registerUser = async ({ store, body }) => {
    validateUserPayload(body);
    const existing = store.getUserByUsername(body.username);
    if (existing) {
        throw new AppError('User already exists', 409, 'Username already registered.');
    }
    const existingEmail = store.getUserByEmail(body.email);
    if (existingEmail) {
        throw new AppError('Email already exists', 409, 'Email already registered.');
    }
    const user = await store.createUser({
        username: body.username,
        email: body.email,
        passwordHash: hashPassword(body.password),
    });
    return {
        status: 201,
        body: {
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        },
    };
};

const loginUser = async ({ store, body }) => {
    const { username, password } = body || {};
    if (!username || !password) {
        throw new AppError('Missing credentials', 400, 'Username and password are required.');
    }
    const user = store.getUserByUsername(username);
    if (!user) {
        throw new AppError('User not found', 404, 'User not found.');
    }
    if (!verifyPassword(password, user.passwordHash)) {
        throw new AppError('Invalid credentials', 401, 'Invalid credentials.');
    }
    const token = createToken({ userId: user.id, username: user.username }, config.tokenSecret);
    return { status: 200, body: { token } };
};

module.exports = {
    registerUser,
    loginUser,
};
