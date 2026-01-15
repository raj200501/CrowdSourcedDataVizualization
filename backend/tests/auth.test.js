const test = require('node:test');
const assert = require('node:assert/strict');
const { createTempDir, startTestServer, cleanupDir } = require('./helpers');


test('API register and login returns token', async () => {
    const dataDir = await createTempDir();
    const { server, baseUrl } = await startTestServer({ dataDir });

    try {
        const registerResponse = await fetch(`${baseUrl}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'test-user',
                password: 'super-secret',
                email: 'test@example.com',
            }),
        });
        const registerPayload = await registerResponse.json();
        assert.equal(registerResponse.status, 201);
        assert.equal(registerPayload.user.username, 'test-user');

        const loginResponse = await fetch(`${baseUrl}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'test-user',
                password: 'super-secret',
            }),
        });
        const loginPayload = await loginResponse.json();
        assert.equal(loginResponse.status, 200);
        assert.ok(loginPayload.token);
    } finally {
        server.close();
        await cleanupDir(dataDir);
    }
});
