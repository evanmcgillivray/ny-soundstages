import React, { useState } from 'react';

const SoundstageList = ({ stages }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [borough, setBorough] = useState('all');
  const [hasGrid, setHasGrid] = useState('all');
  const [minSize, setMinSize] = useState('');

  const filteredStages = stages.filter(stage => {
    const matchesSearch = stage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stage.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBorough = borough === 'all' || stage.borough === borough;
    const matchesGrid = hasGrid === 'all' || stage.hasGrid === (hasGrid === 'yes');
    const matchesSize = !minSize || stage.squareFootage >= parseInt(minSize);
    
    return matchesSearch && matchesBorough && matchesGrid && matchesSize;
  });

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search stages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <select 
          value={borough} 
          onChange={(e) => setBorough(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Boroughs</option>
          <option value="Manhattan">Manhattan</option>
          <option value="Brooklyn">Brooklyn</option>
          <option value="Queens">Queens</option>
          <option value="Bronx">Bronx</option>
          <option value="Staten Island">Staten Island</option>
        </select>
        <select 
          value={hasGrid} 
          onChange={(e) => setHasGrid(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Stages</option>
          <option value="yes">Has Grid</option>
          <option value="no">No Grid</option>
        </select>
        <input
          type="number"
          placeholder="Min square footage"
          value={minSize}
          onChange={(e) => setMinSize(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStages.map((stage, index) => (
          <div key={index} className="border rounded-lg p-4 shadow">
            <h3 className="text-xl font-bold mb-2">{stage.name}</h3>
            <p className="text-gray-600 mb-2">{stage.address}</p>
            <p className="text-gray-700">{stage.squareFootage.toLocaleString()} sq ft</p>
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 rounded text-sm ${
                stage.hasGrid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {stage.hasGrid ? 'Has Grid' : 'No Grid'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoundstageList;