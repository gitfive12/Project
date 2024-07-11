const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;


const WINDOW_SIZE = 10;

let numbers = [];

const calculateAverage = () => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / Math.min(numbers.length, WINDOW_SIZE);
};

app.get('/numbers/:numberId', async (req, res) => {
  const numberId = req.params.numberId;

    if (!['p', 'f', 'e', 'r'].includes(numberId)) {
    return res.status(400).send('Invalid number ID');
  }

  try {
    const response = await axios.get(`https://your-third-party-server/numbers/${numberId}`);
    const newNumbers = response.data;

    const filteredNumbers = newNumbers.filter(
      (num, index) => newNumbers.indexOf(num) === index && response.data[index].elapsedTime <= 500
    );

    
    numbers = [...new Set([...numbers, ...filteredNumbers])].slice(-WINDOW_SIZE);

    
    const average = calculateAverage();

    res.json({
      windowPrevState: numbers.slice(0, numbers.length - filteredNumbers.length),
      windowCurrState: numbers,
      numbers: filteredNumbers,
      avg: average,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


