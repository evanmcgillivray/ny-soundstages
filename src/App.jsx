import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const App = () => {
  const [stages, setStages] = useState([]);
  const [filteredStages, setFilteredStages] = useState([]);
  const [minHeight, setMinHeight] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fs.readFile('data/grid_specs.json');
      const text = new TextDecoder().decode(response);
      const data = JSON.parse(text);
      const stagesArray = Object.entries(data.stages).map(([name, specs]) => ({
        name,
        ...specs
      }));
      setStages(stagesArray);
      setFilteredStages(stagesArray);
    };
    
    fetchData();
  }, []);

  const handleFilter = () => {
    const filtered = stages.filter(stage => {
      const height = parseInt(stage.grid_height);
      return !minHeight || (height >= parseInt(minHeight));
    });
    setFilteredStages(filtered);
  };

  return (
    <div className="p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>NY Soundstages Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Minimum Grid Height (ft)
              </label>
              <Input
                type="number"
                value={minHeight}
                onChange={(e) => setMinHeight(e.target.value)}
                placeholder="Enter height"
                className="w-40"
              />
            </div>
            <Button 
              onClick={handleFilter}
              className="mt-6"
            >
              Filter
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Studio Name</th>
                  <th className="text-left p-2">Grid Height</th>
                  <th className="text-left p-2">Power</th>
                  <th className="text-left p-2">Verified</th>
                </tr>
              </thead>
              <tbody>
                {filteredStages.map((stage) => (
                  <tr key={stage.name} className="border-b">
                    <td className="p-2">{stage.name}</td>
                    <td className="p-2">{stage.grid_height}</td>
                    <td className="p-2">{stage.power || 'N/A'}</td>
                    <td className="p-2">
                      {stage.verified ? '✓' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;