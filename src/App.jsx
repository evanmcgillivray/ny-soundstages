import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const App = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [gridFilter, setGridFilter] = useState('all');
  const [boroughFilter, setBoroughFilter] = useState('all');
  const [minSize, setMinSize] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/soundstages.csv');
        const text = await response.text();
        console.log('Loaded CSV:', text); // Debug log
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        });
        console.log('Parsed data:', result.data); // Debug log
        if (result.data?.length > 0) {
          setData(result.data);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      }
    };
    loadData();
  }, []);

  const filteredData = data.filter(item => {
    const matchesSearch = (
      item['Studio Name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item['Address']?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesBorough = boroughFilter === 'all' || item.Borough === boroughFilter;
    const matchesGrid = gridFilter === 'all' || item['Has Grid'] === gridFilter;
    const matchesSize = !minSize || item['Square Footage'] >= parseInt(minSize);
    return matchesSearch && matchesBorough && matchesGrid && matchesSize;
  });

  const boroughs = ['all', ...new Set(data.map(item => item.Borough).filter(Boolean))].sort();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">NY Soundstages Directory</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        
        <select 
          value={boroughFilter}
          onChange={(e) => setBoroughFilter(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Boroughs</option>
          {boroughs.filter(b => b !== 'all').map(borough => (
            <option key={borough} value={borough}>{borough}</option>
          ))}
        </select>

        <select 
          value={gridFilter}
          onChange={(e) => setGridFilter(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Stages</option>
          <option value="Yes">With Grid</option>
          <option value="Unknown">Grid Unknown</option>
        </select>

        <input
          type="number"
          placeholder="Min square footage"
          value={minSize}
          onChange={(e) => setMinSize(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredData.map((item, index) => (
          <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-col space-y-1.5">
              <h3 className="text-2xl font-semibold">{item['Studio Name']}</h3>
            </div>
            <div className="p-0 pt-4">
              <p className="text-gray-600 mb-2">{item['Address']}</p>
              <p className="text-gray-700">{parseInt(item['Square Footage']).toLocaleString()} sq ft</p>
              <div className="mt-2 flex justify-between items-center">
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  item['Has Grid'] === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {item['Has Grid'] === 'Yes' ? 'Has Grid' : 'Grid Unknown'}
                </span>
                {item['Phone'] && (
                  <div className="text-sm text-right">
                    <div>{item['Phone']}</div>
                    {item['Email'] && <div className="text-blue-600">{item['Email']}</div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;