import express from 'express';
import OpenAI from 'openai';
import dotenv from "dotenv";
import jsdom from 'jsdom';
const { JSDOM } = jsdom;
import fetch from 'node-fetch';

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
      content: `Your job is to translate natural languge to a dbpedia SPARQL query given a user’s request. Use prefixes. You must anwser only with the query. Here is the first question: ${question}`
    }],
    model: 'gpt-4',
  });
  return chatCompletion.choices[0].message.content;
  return `SELECT ?birthPlace\nWHERE {\n  dbr:Cristiano_Ronaldo dbo:birthPlace ?birthPlace\n}`
}


const dbpediaEndpoint = 'http://dbpedia.org/sparql';
const prefix = `PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbpedia: <http://dbpedia.org/resource/>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
`
async function getAnswerFromDBpedia(query) {
  console.log(query);
  const encodedQuery = encodeURIComponent(prefix + query);

  const answer = await fetch(`${dbpediaEndpoint}?query=${encodedQuery}&format=text%2Fhtml&timeout=30000&debug=on`)
    .then(response => response.text())
    .then(data => {
      const dom = new JSDOM(data);
      return dom.window.document.querySelector("table").textContent
        .replace(/^\s*|\s*$|\s*(\r?\n)\s*|(\s)\s+/gm, "$1$2")
        .replace(/^http:\/\/dbpedia.org\/resource\//gm, '');
    })
    .catch(error => {
      console.error('Error querying DBpedia:', error.message);
    });
  return answer;
}


app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

// Define a sample route
app.post('/ask', async (req, res) => {
  var resp = await askQuestion(req.body.question);
  res.json({ resp: resp });
});

app.post('/dbpedia', async (req, res) => {
  var resp = await getAnswerFromDBpedia(req.body.query);
  res.json({ resp: resp });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
