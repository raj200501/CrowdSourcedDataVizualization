const { isPlainObject } = require('./validation');

const normalizeValue = (value) => {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '') {
            return null;
        }
        const numericValue = Number(trimmed);
        if (!Number.isNaN(numericValue) && trimmed.match(/^[-+]?\d*\.?\d+$/)) {
            return numericValue;
        }
        return trimmed;
    }
    if (value === undefined) {
        return null;
    }
    return value;
};

const cleanRow = (row) => {
    if (Array.isArray(row)) {
        return row.map(normalizeValue).filter((value) => value !== null);
    }
    if (isPlainObject(row)) {
        return Object.entries(row).reduce((acc, [key, value]) => {
            const normalized = normalizeValue(value);
            if (normalized !== null) {
                acc[key] = normalized;
            }
            return acc;
        }, {});
    }
    return normalizeValue(row);
};

const removeEmptyRows = (data) => data.filter((row) => {
    if (row === null || row === undefined) {
        return false;
    }
    if (Array.isArray(row)) {
        return row.length > 0;
    }
    if (isPlainObject(row)) {
        return Object.keys(row).length > 0;
    }
    return true;
});

const cleanData = (data) => {
    if (!Array.isArray(data)) {
        return [];
    }
    const normalized = data.map(cleanRow);
    return removeEmptyRows(normalized);
};

module.exports = {
    cleanData,
    normalizeValue,
    cleanRow,
};
