import express from 'express';
import path from 'path';
const app = express();
const port = 3000; // You can change this to your preferred port

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/public", express.static('./public/'));
app.use("/node_modules", express.static('./node_modules/'));
app.use("/ressources", express.static('./ressources/'));


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
    return (answer);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

// Define a sample route
app.post('/ask', (req, res) => {
  resp = askQuestion(req);
  res.json({ resp });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
