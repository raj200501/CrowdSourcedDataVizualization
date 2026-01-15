const http = require('http');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createApp } = require('../backend/app');

const createTempDir = async () => fs.promises.mkdtemp(path.join(os.tmpdir(), 'csviz-smoke-'));

const run = async () => {
    const dataDir = await createTempDir();
    const { handler } = await createApp({ dataDir });
    const server = http.createServer(handler);

    await new Promise((resolve) => server.listen(0, resolve));
    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}`;

    try {
        const sseController = new AbortController();
        const sseResponse = await fetch(`${baseUrl}/api/collaboration/stream`, { signal: sseController.signal });
        assert.equal(sseResponse.status, 200);
        sseController.abort();

        const datasetPayload = {
            name: 'Smoke Test Dataset',
            uploadedBy: 'smoke-runner',
            data: [
                { region: 'NA', score: 97 },
                { region: 'EU', score: 89 },
                { region: 'APAC', score: 91 },
            ],
        };

        const uploadResponse = await fetch(`${baseUrl}/api/data/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datasetPayload),
        });
        const uploadBody = await uploadResponse.json();
        assert.equal(uploadResponse.status, 201);

        const datasetId = uploadBody.dataset.id;

        const cleanResponse = await fetch(`${baseUrl}/api/data/${datasetId}/clean`, { method: 'POST' });
        assert.equal(cleanResponse.status, 200);

        const visualizationResponse = await fetch(`${baseUrl}/api/data/${datasetId}/visualization`);
        const visualizationBody = await visualizationResponse.json();
        assert.equal(visualizationBody.summary.rowCount, 3);
        assert.ok(visualizationBody.summary.columns.includes('region'));

        const annotationResponse = await fetch(`${baseUrl}/api/data/${datasetId}/annotations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author: 'smoke-runner', message: 'Looks consistent.' }),
        });
        assert.equal(annotationResponse.status, 201);

        const detailResponse = await fetch(`${baseUrl}/api/data/${datasetId}`);
        const detailBody = await detailResponse.json();
        assert.equal(detailBody.annotations.length, 1);

        console.log('Smoke test passed.');
    } finally {
        server.close();
        await fs.promises.rm(dataDir, { recursive: true, force: true });
    }
};

run().catch((error) => {
    console.error('Smoke test failed:', error);
    process.exit(1);
});
