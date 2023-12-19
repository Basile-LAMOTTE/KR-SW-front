import express from "express";
import path from "path";

const app = express();
const port = 3000;

app.use("/public", express.static('./public/'));
app.use("/node_modules", express.static('./node_modules/'));
app.use("/ressources", express.static('./ressources/'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

// app.get('/data', (req, res) => {
//   res.sendFile(path.resolve('output.txt'));
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
