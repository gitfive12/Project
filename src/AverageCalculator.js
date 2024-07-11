// src/AverageCalculator.js

import React, { useState, useEffect } from 'react';

function AverageCalculator() {
  const [average, setAverage] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [prevNumbers, setPrevNumbers] = useState([]);
  const windowSize = 10;

  const fetchNumbers = async (id) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 500);
      const response = await fetch(`http://localhost:3000/numbers/${id}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.numbers;
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  };

  const calculateAverage = (nums) => {
    if (nums.length === 0) return null;
    const sum = nums.reduce((acc, num) => acc + num, 0);
    return (sum / nums.length).toFixed(2);
  };

  const updateNumbers = async (id) => {
    const newNumbers = await fetchNumbers(id);

    if (newNumbers.length > 0) {
      const uniqueNumbers = Array.from(new Set([...numbers, ...newNumbers]));
      const windowedNumbers = uniqueNumbers.slice(-windowSize);

      setPrevNumbers(numbers);
      setNumbers(windowedNumbers);
      setAverage(calculateAverage(windowedNumbers));
    }
  };

  useEffect(() => {
    // Fetch initial numbers with a default ID
    updateNumbers('p');
  }, []);

  return (
    <div className="AverageCalculator">
      <button onClick={() => updateNumbers('p')}>Fetch Prime Numbers</button>
      <button onClick={() => updateNumbers('f')}>Fetch Fibonacci Numbers</button>
      <button onClick={() => updateNumbers('e')}>Fetch Even Numbers</button>
      <button onClick={() => updateNumbers('r')}>Fetch Random Numbers</button>
      <p>Previous Numbers: {JSON.stringify(prevNumbers)}</p>
      <p>Current Numbers: {JSON.stringify(numbers)}</p>
      <p>Average: {average}</p>
    </div>
  );
}

export default AverageCalculator;

