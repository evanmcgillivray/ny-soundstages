// index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>NY Soundstages Directory</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/papaparse/5.4.1/papaparse.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;

    const SoundstageDirectory = () => {
      const [data, setData] = useState([]);
      const [searchTerm, setSearchTerm] = useState('');
      const [gridFilter, setGridFilter] = useState('all');
      const [boroughFilter, setBoroughFilter] = useState('all');
      const [error, setError] = useState(null);
      
      useEffect(() => {
        console.log('Fetching data...');
        fetch('../data/soundstages.csv')
          .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
          })
          .then(csvText => {
            console.log('CSV text received, first 100 chars:', csvText.substring(0, 100));
            const result = Papa.parse(csvText, {
              header: true,
              skipEmptyLines: true,
              error: (error) => {
                console.error('Papa Parse error:', error);
                setError(error.message);
              }
            });
            console.log('Parsed data:', result);
            setData(result.data);
          })
          .catch(error => {
            console.error('Fetch error:', error);
            setError(error.message);
          });
      }, []);

      if (error) {
        return <div className="text-red-600">Error loading data: {error}</div>;
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

    ReactDOM.render(
      <SoundstageDirectory />,
      document.getElementById('root')
    );
  </script>
</body>
</html>
