import fs from 'fs/promises';
import path from 'path';

async function processStudio(studioName) {
  // Load existing data
  const dataPath = path.join('public', 'data', 'studios.json');
  let studios = [];
  
  try {
    const existingData = await fs.readFile(dataPath, 'utf8');
    studios = JSON.parse(existingData).studios;
  } catch (err) {
    // File doesn't exist yet, start with empty array
    console.log('Creating new studios data file');
  }

  // Example studio data structure
  const studioData = {
    name: studioName,
    lastUpdated: new Date().toISOString(),
    websiteUrl: "",
    squareFootage: 0,
    hasGrid: false,
    gridHeight: "",
    address: "",
    borough: "",
    phone: "",
    email: "",
    features: [],
    stages: [],
    verified: false
  };

  // Add or update studio in the array
  const existingIndex = studios.findIndex(s => s.name === studioName);
  if (existingIndex >= 0) {
    studios[existingIndex] = { ...studios[existingIndex], ...studioData };
  } else {
    studios.push(studioData);
  }

  // Save back to file
  await fs.writeFile(dataPath, JSON.stringify({ studios }, null, 2), 'utf8');
  
  return studioData;
}

