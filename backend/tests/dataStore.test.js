const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const { DataStore } = require('../storage/dataStore');

test('DataStore persists and retrieves datasets', async () => {
    const filePath = path.join(await fs.promises.mkdtemp('/tmp/csviz-store-'), 'store.json');
    const store = new DataStore(filePath);
    await store.initialize();

    const dataset = await store.createDataset({
        name: 'Test Dataset',
        data: [{ value: 1 }],
        uploadedBy: 'tester',
        description: 'sample',
        tags: ['unit'],
    });

    const loaded = store.getDatasetById(dataset.id);
    assert.equal(loaded.name, 'Test Dataset');
    await store.persist();

    const storeReloaded = new DataStore(filePath);
    await storeReloaded.initialize();
    assert.equal(storeReloaded.listDatasets().length, 1);
});
