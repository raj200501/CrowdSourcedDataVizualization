const test = require('node:test');
const assert = require('node:assert/strict');
const { cleanData, normalizeValue } = require('../utils/dataCleaning');

test('normalizeValue trims strings and parses numbers', () => {
    assert.equal(normalizeValue('  42 '), 42);
    assert.equal(normalizeValue('hello'), 'hello');
    assert.equal(normalizeValue(''), null);
});

test('cleanData removes nulls and empty objects', () => {
    const input = [
        { name: 'Alpha', score: '10', note: '' },
        null,
        { name: 'Beta', score: 20 },
        {},
    ];
    const cleaned = cleanData(input);
    assert.equal(cleaned.length, 2);
    assert.deepEqual(cleaned[0], { name: 'Alpha', score: 10 });
});
