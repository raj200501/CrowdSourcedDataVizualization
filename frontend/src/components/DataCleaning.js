import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataCleaning() {
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data');
        setDatasets(response.data);
      } catch (error) {
        console.error('Error fetching datasets', error);
      }
    };

    fetchData();
  }, []);

  const handleCleanData = async (id) => {
    try {
      const response = await axios.post(`/api/data/clean/${id}`);
      console.log('Data cleaned successfully', response.data);
    } catch (error) {
      console.error('Error cleaning data', error);
    }
  };

  return (
    <div>
      <h2>Data Cleaning</h2>
      <ul>
        {datasets.map(dataset => (
          <li key={dataset._id}>
            {dataset.name}
            <button onClick={() => handleCleanData(dataset._id)}>Clean Data</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataCleaning;
