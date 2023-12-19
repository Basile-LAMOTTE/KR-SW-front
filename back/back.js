const express = require('express');
const app = express();
const port = 3000; // You can change this to your preferred port

// Middleware to parse JSON request bodies
app.use(express.json());

async function askQuestion(question) {
  const apiKey = 'YOUR_API_KEY';
  const apiUrl = 'API-URL'
  try {
    const response = await axios.post(
      apiUrl,
      {
        prompt: question,
        max_tokens: 50, // Adjust as needed
        stop: null,     // Optionally, specify stop words
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract and print the model's response
    const answer = response.data.choices[0].text.trim();
    return(answer);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

// Define a sample route
app.post('/ask', (req, res) => {
  resp = askQuestion(req);
  res.json({resp});
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
