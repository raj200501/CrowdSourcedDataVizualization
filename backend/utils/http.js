const fs = require('fs');
const path = require('path');

const parseJsonBody = async (req, limit = '2mb') => {
    const maxBytes = parseLimit(limit);
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
            if (body.length > maxBytes) {
                reject(Object.assign(new Error('Request body too large'), { statusCode: 413, publicMessage: 'Request body too large.' }));
                req.destroy();
            }
        });
        req.on('end', () => {
            if (!body) {
                resolve({});
                return;
            }
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(Object.assign(new Error('Invalid JSON body'), { statusCode: 400, publicMessage: 'Invalid JSON payload.' }));
            }
        });
        req.on('error', reject);
    });
};

const parseLimit = (limit) => {
    if (typeof limit === 'number') {
        return limit;
    }
    const match = String(limit).trim().toLowerCase().match(/^(\d+)(kb|mb)?$/);
    if (!match) {
        return 1024 * 1024;
    }
    const value = Number(match[1]);
    const unit = match[2];
    if (unit === 'kb') {
        return value * 1024;
    }
    if (unit === 'mb') {
        return value * 1024 * 1024;
    }
    return value;
};

const sendJson = (res, statusCode, payload) => {
    const body = JSON.stringify(payload);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
    });
    res.end(body);
};

const sendText = (res, statusCode, payload) => {
    res.writeHead(statusCode, {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(payload),
    });
    res.end(payload);
};

const sendError = (res, error) => {
    const status = error.statusCode || 500;
    sendJson(res, status, { message: error.publicMessage || 'Unexpected server error' });
};

const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
};

const serveStatic = async (res, filePath) => {
    try {
        const stat = await fs.promises.stat(filePath);
        if (stat.isDirectory()) {
            return false;
        }
        const ext = path.extname(filePath);
        const contentType = contentTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
};

module.exports = {
    parseJsonBody,
    sendJson,
    sendText,
    sendError,
    serveStatic,
};
