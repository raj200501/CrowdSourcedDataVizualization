const parseJson = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
};

const request = async (path, options) => {
    const response = await fetch(path, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });
    return parseJson(response);
};

const api = {
    listDatasets: () => request('/api/data'),
    getDataset: (id) => request(`/api/data/${id}`),
    uploadDataset: (payload) => request('/api/data/upload', {
        method: 'POST',
        body: JSON.stringify(payload),
    }),
    cleanDataset: (id) => request(`/api/data/${id}/clean`, {
        method: 'POST',
    }),
    addAnnotation: (id, payload) => request(`/api/data/${id}/annotations`, {
        method: 'POST',
        body: JSON.stringify(payload),
    }),
    getVisualization: (id) => request(`/api/data/${id}/visualization`),
};

window.api = api;
