const datasetList = document.getElementById('datasetList');
const datasetDetail = document.getElementById('datasetDetail');
const uploadForm = document.getElementById('uploadForm');
const uploadStatus = document.getElementById('uploadStatus');
const annotationForm = document.getElementById('annotationForm');
const annotationStatus = document.getElementById('annotationStatus');
const visualizationSummary = document.getElementById('visualizationSummary');
const connectionIndicator = document.getElementById('connectionIndicator');
const connectionLabel = document.getElementById('connectionLabel');

let selectedDatasetId = null;

const formatDate = (value) => new Date(value).toLocaleString();

const setStatus = (element, message) => {
    element.textContent = message;
};

const renderDatasetList = (datasets) => {
    datasetList.innerHTML = '';
    if (!datasets.length) {
        datasetList.innerHTML = '<p>No datasets yet. Upload one to get started.</p>';
        return;
    }
    datasets.forEach((dataset) => {
        const card = document.createElement('div');
        card.className = 'dataset-card';
        card.innerHTML = `
            <h3>${dataset.name}</h3>
            <div class="dataset-meta">Rows: ${dataset.data.length} • Uploaded by ${dataset.uploadedBy}</div>
            <div class="dataset-meta">Updated ${formatDate(dataset.updatedAt)}</div>
            <button class="secondary" data-id="${dataset.id}">View details</button>
        `;
        card.querySelector('button').addEventListener('click', () => selectDataset(dataset.id));
        datasetList.appendChild(card);
    });
};

const renderDatasetDetail = (dataset, annotations) => {
    if (!dataset) {
        datasetDetail.innerHTML = '<p>Select a dataset to see details.</p>';
        return;
    }
    const annotationList = annotations.length
        ? `<ul>${annotations.map((annotation) => `<li><strong>${annotation.author}</strong>: ${annotation.message}</li>`).join('')}</ul>`
        : '<p>No annotations yet.</p>';

    datasetDetail.innerHTML = `
        <div><strong>ID:</strong> ${dataset.id}</div>
        <div><strong>Description:</strong> ${dataset.description || 'No description provided.'}</div>
        <div><strong>Tags:</strong> ${(dataset.tags || []).join(', ') || 'None'}</div>
        <div><strong>Rows:</strong> ${dataset.data.length}</div>
        <div><strong>Last updated:</strong> ${formatDate(dataset.updatedAt)}</div>
        <div><strong>Annotations:</strong> ${annotationList}</div>
        <button id="cleanDatasetButton">Clean dataset</button>
    `;
    document.getElementById('cleanDatasetButton').addEventListener('click', () => cleanDataset(dataset.id));
};

const renderVisualization = (summary) => {
    if (!summary) {
        visualizationSummary.innerHTML = '<p>Select a dataset to view summary statistics.</p>';
        return;
    }

    const columns = summary.columns.map((column) => {
        const stats = summary.columnStats[column];
        const barWidth = Math.min(stats.count * 10, 100);
        return `
            <div class="summary-bar">
                <strong>${column}</strong>
                <div class="bar" style="width: ${barWidth}%"></div>
                <div class="dataset-meta">Count: ${stats.count} | Unique: ${stats.uniqueCount}${stats.mean !== undefined ? ` | Mean: ${stats.mean}` : ''}</div>
            </div>
        `;
    }).join('');

    visualizationSummary.innerHTML = `
        <div><strong>Rows:</strong> ${summary.rowCount}</div>
        <div><strong>Columns:</strong> ${summary.columnCount}</div>
        <div class="summary">${columns || '<p>No columns detected.</p>'}</div>
    `;
};

const refreshDatasets = async () => {
    const { datasets } = await window.api.listDatasets();
    renderDatasetList(datasets);
    if (selectedDatasetId) {
        await selectDataset(selectedDatasetId);
    }
};

const selectDataset = async (datasetId) => {
    selectedDatasetId = datasetId;
    annotationForm.dataset.datasetId = datasetId;
    annotationForm.querySelector('input[name="datasetId"]').value = datasetId;
    const detail = await window.api.getDataset(datasetId);
    renderDatasetDetail(detail.dataset, detail.annotations);
    const visualization = await window.api.getVisualization(datasetId);
    renderVisualization(visualization.summary);
};

const cleanDataset = async (datasetId) => {
    setStatus(uploadStatus, 'Cleaning dataset...');
    await window.api.cleanDataset(datasetId);
    setStatus(uploadStatus, 'Dataset cleaned and saved.');
    await refreshDatasets();
};

uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        setStatus(uploadStatus, 'Uploading dataset...');
        const formData = new FormData(uploadForm);
        const tags = formData.get('tags');
        const dataText = formData.get('data');
        const payload = {
            name: formData.get('name'),
            uploadedBy: formData.get('uploadedBy'),
            description: formData.get('description'),
            tags: tags ? tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
            data: JSON.parse(dataText),
        };
        await window.api.uploadDataset(payload);
        setStatus(uploadStatus, 'Dataset uploaded successfully.');
        uploadForm.reset();
        await refreshDatasets();
    } catch (error) {
        setStatus(uploadStatus, `Upload failed: ${error.message}`);
    }
});

annotationForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        setStatus(annotationStatus, 'Submitting annotation...');
        const formData = new FormData(annotationForm);
        await window.api.addAnnotation(formData.get('datasetId'), {
            author: formData.get('author'),
            message: formData.get('message'),
        });
        setStatus(annotationStatus, 'Annotation saved.');
        annotationForm.reset();
        await refreshDatasets();
    } catch (error) {
        setStatus(annotationStatus, `Annotation failed: ${error.message}`);
    }
});

const initCollaboration = () => {
    const eventSource = new EventSource('/api/collaboration/stream');
    eventSource.addEventListener('open', () => {
        connectionIndicator.classList.add('connected');
        connectionLabel.textContent = 'Connected';
    });
    eventSource.addEventListener('error', () => {
        connectionIndicator.classList.remove('connected');
        connectionLabel.textContent = 'Disconnected';
    });
    eventSource.addEventListener('dataset:created', refreshDatasets);
    eventSource.addEventListener('dataset:updated', refreshDatasets);
    eventSource.addEventListener('annotation:created', refreshDatasets);
};

refreshDatasets().catch((error) => {
    setStatus(uploadStatus, `Failed to load datasets: ${error.message}`);
});
initCollaboration();
