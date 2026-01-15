const { validateDatasetPayload, validateAnnotationPayload } = require('../utils/validation');
const { cleanData } = require('../utils/dataCleaning');
const { createVisualizationSummary } = require('../utils/visualization');
const { AppError } = require('../utils/errors');

const listDatasets = async ({ store }) => {
    return { status: 200, body: { datasets: store.listDatasets() } };
};

const getDataset = async ({ store, params }) => {
    const dataset = store.getDatasetById(params.id);
    if (!dataset) {
        throw new AppError('Dataset not found', 404, 'Dataset not found.');
    }
    return {
        status: 200,
        body: { dataset, annotations: store.listAnnotations(dataset.id) },
    };
};

const uploadData = async ({ store, body }) => {
    validateDatasetPayload(body);
    const dataset = await store.createDataset({
        name: body.name.trim(),
        data: body.data,
        uploadedBy: body.uploadedBy.trim(),
        description: body.description,
        tags: body.tags,
    });
    return { status: 201, body: { dataset } };
};

const cleanDataset = async ({ store, params }) => {
    const dataset = store.getDatasetById(params.id);
    if (!dataset) {
        throw new AppError('Dataset not found', 404, 'Dataset not found.');
    }
    const cleaned = cleanData(dataset.data);
    const updated = await store.updateDataset(dataset.id, { data: cleaned });
    return { status: 200, body: { dataset: updated, cleanedRows: cleaned.length } };
};

const addAnnotation = async ({ store, params, body }) => {
    validateAnnotationPayload(body);
    const dataset = store.getDatasetById(params.id);
    if (!dataset) {
        throw new AppError('Dataset not found', 404, 'Dataset not found.');
    }
    const annotation = await store.addAnnotation({
        datasetId: dataset.id,
        author: body.author.trim(),
        message: body.message.trim(),
        metadata: body.metadata,
    });
    return { status: 201, body: { annotation } };
};

const visualizationSummary = async ({ store, params }) => {
    const dataset = store.getDatasetById(params.id);
    if (!dataset) {
        throw new AppError('Dataset not found', 404, 'Dataset not found.');
    }
    const summary = createVisualizationSummary(dataset.data);
    return { status: 200, body: { datasetId: dataset.id, summary } };
};

module.exports = {
    listDatasets,
    getDataset,
    uploadData,
    cleanDataset,
    addAnnotation,
    visualizationSummary,
};
