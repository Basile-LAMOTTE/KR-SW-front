import express from 'express';
import OpenAI from 'openai';
import dotenv from "dotenv";
// dotenv.config({ path: process.cwd() + '/.env' })
dotenv.config();
import path from 'path';
const app = express();
const port = 3000; // You can change this to your preferred port

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/public", express.static('./public/'));
app.use("/node_modules", express.static('./node_modules/'));
app.use("/ressources", express.static('./ressources/'));

const openai = new OpenAI({
  apiKey: process.env.API_KEY, // This is the default and can be omitted
});


async function askQuestion(question) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{
      role: 'user',
      content: `Your job is to translate natural languge to a SPARQL query given a user’s request. You must anwser only with the query. Here is the first question: ${question}`
    }],
    model: 'gpt-3.5-turbo',
  });
  return chatCompletion.choices[0].message.content;
  return "SELECT ?capital\nWHERE {\n  wd:Q155 wdt:P36 ?capital.\n  ?capital wdt:P31 wd:Q484170.\n}"
}

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

// Define a sample route
app.post('/ask', async (req, res) => {
  var resp = await askQuestion(req.body.question);
  res.json({ resp: resp });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
