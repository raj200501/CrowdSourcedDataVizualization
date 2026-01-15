const test = require('node:test');
const assert = require('node:assert/strict');
const { createVisualizationSummary } = require('../utils/visualization');


test('createVisualizationSummary returns column stats', () => {
    const data = [
        { region: 'NA', score: 90 },
        { region: 'EU', score: 85 },
        { region: 'NA', score: 95 },
    ];

    const summary = createVisualizationSummary(data);
    assert.equal(summary.rowCount, 3);
    assert.equal(summary.columnCount, 2);
    assert.ok(summary.columns.includes('region'));
    assert.equal(summary.columnStats.region.uniqueCount, 2);
    assert.equal(summary.columnStats.score.mean, 90);
});
