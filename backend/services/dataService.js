const Dataset = require('../models/dataset');

exports.createDataset = async (data) => {
    const dataset = new Dataset(data);
    return await dataset.save();
};

exports.getDataset = async (id) => {
    return await Dataset.findById(id);
};

exports.updateDataset = async (id, data) => {
    return await Dataset.findByIdAndUpdate(id, data, { new: true });
};
