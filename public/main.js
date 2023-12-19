const app = new PIXI.Application({
  autoResize: true,
  resolution: devicePixelRatio,
  backgroundAlpha: 1,
  backgroundColor: 0x222222
});

document.body.appendChild(app.view);

let inputText = "";
let ctrlMode = false;
let shiftMode = false;
let userIsWriting = false;
let shockWave = false;
let repetitions = 0;
let randomString = "";

// help logo
const helpLogo = PIXI.Sprite.from('../ressources/helplogo.png');
helpLogo.x = window.innerWidth - 60;
helpLogo.y = 60;
helpLogo.anchor.set(0.5);
helpLogo.scale.set(0.08);

// gradient
const gradient = PIXI.Sprite.from('../ressources/gradient.png');
gradient.width = window.innerWidth;
gradient.height = window.innerHeight;

// flakes
var flakes = new PIXI.Container();

for (let i = 0; i < 200; i++) {
  const flake = new PIXI.Graphics();
  flake.beginFill(0x00FF00);
  flake.drawCircle(0, 0, 2 + Math.random() * 3);
  flake.x = Math.random() * window.innerWidth * 2 - window.innerWidth;
  flake.y = Math.random() * window.innerHeight;
  flake.xspeed = 1 + Math.random();
  flake.yspeed = 2 + Math.random() * 2;
  flake.endFill();
  flakes.addChild(flake);
}

// by doing this the gradient is only visible through the flakes
gradient.mask = flakes;


// text base style
const style = new PIXI.TextStyle({
  fontFamily: "Roboto Mono",
  fontWeight: "bold",
  align: "center",
  fontSize: 60,
  fill: "white",
});

// random text for loading
const loadingText = new PIXI.Text('    ', { ...style });
loadingText.anchor.set(0.5);
loadingText.x = window.innerWidth / 2;
loadingText.y = window.innerHeight * 1.3;

// query searched by the user
const queryText = new PIXI.Text('', { ...style, fontSize: 40 });
queryText.anchor.set(0.5);
queryText.x = window.innerWidth / 2;
queryText.y = 0;

// bottom and top cover that is displayed after the user press enter
const bottomPanel = PIXI.Sprite.from(PIXI.Texture.WHITE);
bottomPanel.tint = "#111111";
bottomPanel.width = window.innerWidth;
bottomPanel.height = window.innerHeight;
bottomPanel.y = window.innerHeight;

const topPanel = PIXI.Sprite.from(PIXI.Texture.WHITE);
topPanel.tint = "#111111";
topPanel.width = window.innerWidth;
topPanel.height = window.innerHeight;
topPanel.y = 0;
topPanel.anchor.y = 1;


// user input 
const userInput = new PIXI.Text('', { ...style });

// input box that is behind the user input
const inputBackground = PIXI.Sprite.from(PIXI.Texture.WHITE);
inputBackground.tint = "#222222";
inputBackground.anchor.set(0.5);
inputBackground.width = 600;
inputBackground.height = 100;
inputBackground.filters = [new PIXI.BlurFilter(60)];

// cursor
const cursor = PIXI.Sprite.from(PIXI.Texture.WHITE);
cursor.tint = "#FFFFFF";
cursor.anchor.set(0.5);
cursor.width = 10;
cursor.height = style.fontSize;


// add sprites to stage
app.stage.addChild(gradient);
app.stage.addChild(flakes);
app.stage.addChild(inputBackground);
app.stage.addChild(cursor);
app.stage.addChild(helpLogo);
app.stage.addChild(userInput);
app.stage.addChild(bottomPanel);
app.stage.addChild(topPanel);
app.stage.addChild(loadingText);
app.stage.addChild(queryText);


// shockwave effect dissplayed when the user press enter
const shockwaveEffect = new PIXI.filters.ShockwaveFilter([window.innerWidth / 2, window.innerHeight / 2]);
shockwaveEffect.radius = -1;
shockwaveEffect.time = -1;
shockwaveEffect.brightness = 1;
shockwaveEffect.amplitude = 80;
shockwaveEffect.wavelength = 500;

userInput.filters = [shockwaveEffect];
gradient.filters = [shockwaveEffect];

// WIP
const reflectionFilter = new PIXI.filters.ReflectionFilter();
reflectionFilter.boundary = 0.6;
reflectionFilter.alpha = [1, 0];

// app.stage.filters = [reflectionFilter];


function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  inputBackground.x = window.innerWidth / 2;
  inputBackground.y = window.innerHeight / 2;
  cursor.x = window.innerWidth / 2;
  cursor.y = window.innerHeight / 2 - 10;
  userInput.x = window.innerWidth / 2;
  userInput.y = window.innerHeight / 2 - inputBackground.height / 2 + 10;
}
resize();
// will run at every resize of the window, so all sprites remain centered no matter what
window.addEventListener('resize', resize);

// manage ctrl shorcuts
function shortcutManager(key) {
  if (key === "Backspace") {
    if (inputText.slice(-1) === " ") inputText = inputText.slice(0, -1);
    inputText = inputText.slice(0, inputText.lastIndexOf(" ") + 2)
  }
  if (key === "v") {
    navigator.clipboard.readText()
      .then(text => {
        inputText += text;
      })
      .catch(err => {
        console.error('Failed to read clipboard contents: ', err);
      });
  }
}

function reduceSprite(sprite) {
  const ticker = PIXI.Ticker.shared;

  const onTick = (deltaTime) => {
    sprite.scale.x *= 0.9;
    sprite.scale.y *= 0.9;
    if (sprite.scale.x <= 0.01) {
      sprite.visible = false;
      ticker.remove(onTick);
    }
  }

  ticker.add(onTick);
}

function togglePanels() {
  const ticker = PIXI.Ticker.shared;
  const target = window.innerHeight;
  queryText.text = inputText;

  const onTick = (deltaTime) => {
    // resultPanel.y += 0.5;
    bottomPanel.y += (0 - bottomPanel.y) * 0.01;
    topPanel.y += (target - topPanel.y) * 0.01;
    loadingText.y += (window.innerHeight / 2 - loadingText.y) * 0.01;
    queryText.y += (window.innerHeight * 0.1 - queryText.y) * 0.03;
  }

  ticker.add(onTick);
}

String.prototype.replaceAt = function(index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

window.addEventListener('keydown', function(event) {
  userIsWriting = true;
  setTimeout(() => userIsWriting = false, 1500);
  const key = event.key;
  if (ctrlMode) {
    shortcutManager(key);
  }
  // special keys
  if (key === "Control") ctrlMode = true;
  if (key === "Shift") shiftMode = true;
  if (key === "Escape") {
    inputText = "";
    userInput.tint = "#FFFF00";
    changeToRandomQuestion();
  }
  if (key === "Backspace") {
    inputText = inputText.slice(0, -1);
    if (inputText.length === 0) changeToRandomQuestion();
  }
  if (key === "Enter") {
    if (inputText.length === 0) inputText = userInput.text;
    reduceSprite(userInput);
    // fadeIn(searchingText, 3000)
    inputBackground.visible = false;
    setTimeout(() => togglePanels(), 1000)
    cursor.visible = false;
    shockWave = true;
    shockwaveEffect.time = 0;
    console.log(`user input: '${inputText}'`)
  }
  if (ctrlMode) return; // don't type if ctrl key is held
  if (key.length > 1) return; // only add alpha alpha keys to input text
  inputText += shiftMode ? key.toUpperCase() : key;
  if (inputBackground.width > window.innerWidth * 0.9) {
    inputText = inputText.replaceAt(inputText.lastIndexOf(' '), '\n');
  }
});

window.addEventListener('keyup', function(event) {
  const key = event.key;
  if (key === "Control") ctrlMode = false;
  if (key === "Shift") shiftMode = false;
  if (key === "Escape") userInput.tint = "#FFFFFF";
});

var cursorBlink = window.setInterval(function() {
  cursor.alpha = cursor.alpha === 1 ? 0 : 1;
  if (userIsWriting) cursor.alpha = 1; // keep cursor visible if user is writing
}, 600);

const listOfSymbols = "!@#$%^&*()_+=-/.,<>?\\'\"[]{}`~";

function updateFlake(flake) {
  if (flake.y > window.innerHeight || flake.x > window.innerWidth) {
    flake.y = 0;
    flake.x = Math.random() * window.innerWidth * 2 - window.innerWidth;
  }
  flake.y += flake.yspeed;
  flake.x += flake.xspeed;
}

const listOfLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const listOfQuestions = [
  "What is the capital of Brazil?",
  "What is the largest mammal on Earth?",
  "When was Linus Torvalds born?",
  "Who wrote 'Romeo and Juliet'?",
  "Who is the current president of France?",
  "When did the Industrial Revolution begin?",
  "What is the capital of Japan?",
  "Who painted the Mona Lisa?",
  "What is the currency of Australia?",
  "When was the Declaration of Independence signed?",
  "Who is the author of 'To Kill a Mockingbird'?",
  "What is the boiling point of water in Fahrenheit?",
  "Who developed the theory of relativity?",
  "What is the largest ocean on Earth?",
  "When was the World Wide Web invented?",
];
function changeToRandomQuestion() {
  var question = repetitions < 2 ? listOfQuestions[Math.floor(Math.random() * listOfQuestions.length)] : "What are you looking for?"
  let iterations = 0;

  const interval = setInterval(() => {
    randomString = question
      .split("")
      .map((letter, index) => {
        if (index < iterations) {
          return question[index];
        }

        return listOfLetters[Math.floor(Math.random() * 26 * 2)]
      }).join("")
    if (iterations >= question.length) {
      clearInterval(interval);
      if (repetitions < 2)
        setTimeout(() => changeToRandomQuestion(), 1000)
      repetitions++;
    }
    iterations++;
  }, 30)
  return randomString;
}

changeToRandomQuestion();

app.ticker.add((delta) => {
  userInput.text = inputText.length > 0 ? inputText : randomString;
  userInput.x = window.innerWidth / 2 - userInput.width / 2;
  cursor.x = window.innerWidth / 2 + userInput.width / 2 + 10;
  if (userInput.width + 100 > inputBackground.width) inputBackground.width = userInput.width + 100;
  else if (inputBackground.width > 600 && userInput.width + 100 < inputBackground.width) inputBackground.width -= 50;
  flakes.children.forEach(flake => {
    updateFlake(flake);
  });
  if (shockwaveEffect.time > 2.5) {
    shockWave = false;
    shockwaveEffect.time = -1;
  }
  if (shockWave)
    shockwaveEffect.time += 0.03;
  loadingText.text = loadingText.text.split("")
    .map((letter, index) => {
      return listOfSymbols[Math.floor(Math.random() * listOfSymbols.length)]
    }).join("")
});


