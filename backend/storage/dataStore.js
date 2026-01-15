const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const crypto = require('crypto');

const defaultState = () => ({
    users: [],
    datasets: [],
    annotations: [],
});

const ensureDir = async (dirPath) => {
    await fs.promises.mkdir(dirPath, { recursive: true });
};

const safeRead = async (filePath) => {
    try {
        const content = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
};

class DataStore {
    constructor(filePath) {
        this.filePath = filePath;
        this.state = defaultState();
        this.events = new EventEmitter();
    }

    async initialize() {
        await ensureDir(path.dirname(this.filePath));
        const existing = await safeRead(this.filePath);
        if (existing) {
            this.state = { ...defaultState(), ...existing };
        } else {
            await this.persist();
        }
    }

    async persist() {
        const payload = JSON.stringify(this.state, null, 2);
        await fs.promises.writeFile(this.filePath, payload, 'utf8');
    }

    async reset() {
        this.state = defaultState();
        await this.persist();
    }

    listUsers() {
        return [...this.state.users];
    }

    getUserById(userId) {
        return this.state.users.find((user) => user.id === userId) || null;
    }

    getUserByUsername(username) {
        return this.state.users.find((user) => user.username === username) || null;
    }

    getUserByEmail(email) {
        return this.state.users.find((user) => user.email === email) || null;
    }

    async createUser({ username, email, passwordHash }) {
        const newUser = {
            id: crypto.randomUUID(),
            username,
            email,
            passwordHash,
            createdAt: new Date().toISOString(),
        };
        this.state.users.push(newUser);
        await this.persist();
        this.events.emit('user:created', newUser);
        return newUser;
    }

    listDatasets() {
        return [...this.state.datasets];
    }

    getDatasetById(datasetId) {
        return this.state.datasets.find((dataset) => dataset.id === datasetId) || null;
    }

    async createDataset({ name, data, uploadedBy, description, tags }) {
        const newDataset = {
            id: crypto.randomUUID(),
            name,
            description: description || '',
            tags: tags || [],
            data,
            uploadedBy,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.state.datasets.push(newDataset);
        await this.persist();
        this.events.emit('dataset:created', newDataset);
        return newDataset;
    }

    async updateDataset(datasetId, updates) {
        const dataset = this.getDatasetById(datasetId);
        if (!dataset) {
            return null;
        }
        Object.assign(dataset, updates, { updatedAt: new Date().toISOString() });
        await this.persist();
        this.events.emit('dataset:updated', dataset);
        return dataset;
    }

    listAnnotations(datasetId) {
        return this.state.annotations.filter((annotation) => annotation.datasetId === datasetId);
    }

    async addAnnotation({ datasetId, author, message, metadata }) {
        const annotation = {
            id: crypto.randomUUID(),
            datasetId,
            author,
            message,
            metadata: metadata || {},
            createdAt: new Date().toISOString(),
        };
        this.state.annotations.push(annotation);
        await this.persist();
        this.events.emit('annotation:created', annotation);
        return annotation;
    }
}

const createDataStore = async ({ dataDir }) => {
    const filePath = path.join(dataDir, 'store.json');
    const store = new DataStore(filePath);
    await store.initialize();
    return store;
};

module.exports = {
    DataStore,
    createDataStore,
};
