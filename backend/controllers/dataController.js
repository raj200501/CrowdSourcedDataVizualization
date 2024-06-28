const Dataset = require('../models/dataset');
const { cleanData } = require('../utils/dataCleaning');

exports.uploadData = async (req, res) => {
    try {
        let dataset = new Dataset(req.body);
        dataset = await dataset.save();
        res.status(201).json(dataset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cleanData = async (req, res) => {
    try {
        const dataset = await Dataset.findById(req.params.id);
        if (!dataset) {
            return res.status(404).json({ message: 'Dataset not found' });
        }
        const cleanedData = cleanData(dataset.data);
        dataset.data = cleanedData;
        await dataset.save();
        res.status(200).json(dataset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
