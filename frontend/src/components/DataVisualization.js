import React, { useEffect, useState } from 'react';
import { Chart } from 'react-charts';
import axios from 'axios';

function DataVisualization() {
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

  const generateChartData = (dataset) => {
    // Transform the dataset into a format suitable for the chart library
    return dataset.data.map(row => ({
      primary: row[0],
      secondary: row[1],
    }));
  };

  return (
    <div>
      <h2>Data Visualization</h2>
      {datasets.map(dataset => (
        <div key={dataset._id}>
          <h3>{dataset.name}</h3>
          <Chart
            data={[
              {
                label: dataset.name,
                data: generateChartData(dataset),
              },
            ]}
            axes={[
              { primary: true, type: 'linear', position: 'bottom' },
              { type: 'linear', position: 'left' },
            ]}
          />
        </div>
      ))}
    </div>
  );
}

export default DataVisualization;
