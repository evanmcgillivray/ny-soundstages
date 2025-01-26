const { useState, useEffect } = React;

const SoundstageDirectory = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gridFilter, setGridFilter] = useState('all');
  const [boroughFilter, setBoroughFilter] = useState('all');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log('Fetching data...');
    console.log('Attempting to fetch CSV from:', window.location.href);
    fetch('../data/soundstages.csv')
  .then(response => {
    console.log('Response received:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      url: response.url
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
    }
    return response.text();
  })
  .then(csvText => {
    console.log('CSV length:', csvText.length);
    console.log('First 100 chars:', csvText.substring(0, 100));
    
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      error: (error) => {
        console.error('Papa Parse error:', error);
        setError(error.message);
      },
      complete: (results) => {
        console.log('Parse complete:', {
          rows: results.data.length,
          fields: results.meta.fields,
          errors: results.errors
        });
      }
    });

    if (result.data && result.data.length > 0) {
      setData(result.data);
    } else {
      console.error('No data found in parsed CSV:', result);
      setError('No data found in CSV');
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    setError(`Failed to load CSV: ${error.message}`);
  });

  }, []);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredData = data.filter(item => {
    const matchesSearch = (
      item['Studio Name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item['Address']?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesBorough = boroughFilter === 'all' || item.Borough === boroughFilter;
    const matchesGrid = gridFilter === 'all' || item['Has Grid'] === gridFilter;
    return matchesSearch && matchesBorough && matchesGrid;
  });

  const boroughs = ['all', ...new Set(data.map(item => item.Borough))].sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">NY Soundstages Directory</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] p-2 border rounded"
        />
        <select 
          value={boroughFilter}
          onChange={(e) => setBoroughFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Boroughs</option>
          {boroughs.filter(b => b !== 'all').map(borough => (
            <option key={borough} value={borough}>{borough}</option>
          ))}
        </select>
        <select 
          value={gridFilter}
          onChange={(e) => setGridFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Stages</option>
          <option value="Yes">With Grid</option>
          <option value="Unknown">Grid Unknown</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Square Footage</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{item['Studio Name']}</td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {parseInt(item['Square Footage']).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item['Has Grid'] === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {item['Has Grid']}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item['Address']}</td>
                <td className="px-6 py-4">
                  <div>{item['Phone']}</div>
                  <div className="text-sm text-blue-600">{item['Email']}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SoundstageDirectory;
