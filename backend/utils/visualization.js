const { isPlainObject } = require('./validation');

const extractColumns = (data) => {
    const columns = new Set();
    data.forEach((row) => {
        if (isPlainObject(row)) {
            Object.keys(row).forEach((key) => columns.add(key));
        }
    });
    return Array.from(columns);
};

const summarizeColumn = (data, column) => {
    const values = data
        .map((row) => (isPlainObject(row) ? row[column] : undefined))
        .filter((value) => value !== undefined && value !== null);
    const numericValues = values.filter((value) => typeof value === 'number');
    const uniqueValues = Array.from(new Set(values.map((value) => String(value))));

    const summary = {
        count: values.length,
        uniqueCount: uniqueValues.length,
        uniqueValues: uniqueValues.slice(0, 8),
    };

    if (numericValues.length > 0) {
        const total = numericValues.reduce((acc, value) => acc + value, 0);
        summary.min = Math.min(...numericValues);
        summary.max = Math.max(...numericValues);
        summary.mean = Number((total / numericValues.length).toFixed(2));
    }

    return summary;
};

const createVisualizationSummary = (data) => {
    const rowCount = data.length;
    const columns = extractColumns(data);
    const columnStats = columns.reduce((acc, column) => {
        acc[column] = summarizeColumn(data, column);
        return acc;
    }, {});

    return {
        rowCount,
        columnCount: columns.length,
        columns,
        columnStats,
    };
};

module.exports = {
    createVisualizationSummary,
    summarizeColumn,
    extractColumns,
};
