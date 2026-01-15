const crypto = require('crypto');

const createToken = (payload, secret, expiresInSeconds = 3600) => {
    const issuedAt = Math.floor(Date.now() / 1000);
    const body = {
        ...payload,
        iat: issuedAt,
        exp: issuedAt + expiresInSeconds,
    };
    const encoded = Buffer.from(JSON.stringify(body)).toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
    return `${encoded}.${signature}`;
};

const verifyToken = (token, secret) => {
    if (!token) {
        return null;
    }
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature) {
        return null;
    }
    const expected = crypto.createHmac('sha256', secret).update(encoded).digest('base64url');
    if (expected !== signature) {
        return null;
    }
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
    }
    return payload;
};

module.exports = {
    createToken,
    verifyToken,
};
