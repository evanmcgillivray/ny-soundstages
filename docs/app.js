const { useState, useEffect } = React;

const SoundstageDirectory = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gridFilter, setGridFilter] = useState('all');
  const [boroughFilter, setBoroughFilter] = useState('all');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log('Fetching data...');
    fetch('soundstages.csv')  // Changed path to look in same directory
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(csvText => {
        console.log('CSV text received:', csvText.substring(0, 100));
        const result = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          error: (error) => {
            console.error('Papa Parse error:', error);
            setError(error.message);
          }
        });
        console.log('Parsed data:', result);
        if (result.data && result.data.length > 0) {
          setData(result.data);
        } else {
          setError('No data found in CSV');
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError(error.message);
      });
  }, []);

  // Rest of component code stays the same
  [...]
