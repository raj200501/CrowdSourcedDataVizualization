const test = require('node:test');
const assert = require('node:assert/strict');
const { createTempDir, startTestServer, cleanupDir } = require('./helpers');

const sampleData = [
    { country: 'US', score: 95, region: 'NA' },
    { country: 'DE', score: 88, region: 'EU' },
    { country: 'FR', score: 90, region: 'EU' },
];
test('API upload, clean, annotate, visualize', async () => {
    const dataDir = await createTempDir();
    const { server, baseUrl } = await startTestServer({ dataDir });

    try {
        const uploadResponse = await fetch(`${baseUrl}/api/data/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Sample dataset',
                data: sampleData,
                uploadedBy: 'tester',
                tags: ['demo'],
            }),
        });
        const uploadPayload = await uploadResponse.json();
        assert.equal(uploadResponse.status, 201);
        const datasetId = uploadPayload.dataset.id;

        const listResponse = await fetch(`${baseUrl}/api/data`);
        const listPayload = await listResponse.json();
        assert.equal(listPayload.datasets.length, 1);

        const annotationResponse = await fetch(`${baseUrl}/api/data/${datasetId}/annotations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                author: 'ana',
                message: 'Looks good',
            }),
        });
        assert.equal(annotationResponse.status, 201);

        const cleanResponse = await fetch(`${baseUrl}/api/data/${datasetId}/clean`, { method: 'POST' });
        assert.equal(cleanResponse.status, 200);

        const visualizationResponse = await fetch(`${baseUrl}/api/data/${datasetId}/visualization`);
        const visualizationPayload = await visualizationResponse.json();
        assert.equal(visualizationPayload.summary.rowCount, 3);
    } finally {
        server.close();
        await cleanupDir(dataDir);
    }
});
