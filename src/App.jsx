import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const App = () => {
  const [stages, setStages] = useState([]);
  const [filteredStages, setFilteredStages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minHeight, setMinHeight] = useState('');
  const [minSize, setMinSize] = useState('');
  const [borough, setBorough] = useState('all');
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await window.fs.readFile('data