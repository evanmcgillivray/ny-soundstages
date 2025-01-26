import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export function useSoundstages() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStages = async () => {
    try {
      const response = await fetch('/data/soundstages.csv');
      const csvText = await response.text();
      
      const results = Papa.parse(csvText, {
        header: true,
        transform: (value, header) => {
          switch(header) {
            case 'squareFootage':
              return parseInt(value) || 0;
            case 'hasGrid':
              return value.toLowerCase() === 'yes';
            case 'heightToCeiling':
              return parseFloat(value) || 0;
            default:
              return value;
          }
        }
      });

      if (results.errors.length > 0) {
        console.error('CSV parsing errors:', results.errors);
      }

      setStages(results.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching stages:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await fetchStages();
  };

  useEffect(() => {
    fetchStages();
  }, []);

  return {
    stages,
    loading,
    error,
    refreshData
  };
}
