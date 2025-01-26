import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import SoundstageList from './components/SoundstageList';

function App() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('data/soundstages.csv')
      .then(response => response.text())
      .then(csvText => {
        const results = Papa.parse(csvText, {
          header: true,
          transform: (value, header) => {
            if (header === 'squareFootage') return parseInt(value);
            if (header === 'hasGrid') return value.toLowerCase() === 'yes';
            return value;
          }
        });
        setStages(results.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setError('Failed to load soundstages data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">NY Soundstages Directory</h1>
        <SoundstageList stages={stages} />
      </div>
    </div>
  );
}

export default App;