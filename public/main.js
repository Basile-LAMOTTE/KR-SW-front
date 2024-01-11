// Text base style
const style = new PIXI.TextStyle({
  // fontFamily: "Roboto Mono",
  fontFamily: "SpaceMono",
  // fontWeight: 500,
  align: "center",
  // wordWrap: true,
  fontSize: 60,
  fill: "white",
});

// Create the pixi app
const app = new PIXI.Application({
  autoResize: true,
  resolution: window.devicePixelRatio,
  // resolution: devicePixelRatio,
  backgroundAlpha: 1,
  backgroundColor: 0x222222
});

document.body.appendChild(app.view);

// Base variables
let inputText = "";
let ctrlMode = false;
let shiftMode = false;
let userIsWriting = false;
let shockWave = false;
let repetitions = 0;
let randomString = "";
let anwserScreen = false;

// Background gradient
const gradient = PIXI.Sprite.from('../ressources/gradient.png');
gradient.width = window.innerWidth;
gradient.height = window.innerHeight;

// Flake container
const flakesContainer = new PIXI.Container();

// Create flakes
for (let i = 0; i < 200; i++) {
  const flake = new PIXI.Graphics();
  flake.beginFill(0x00FF00);
  flake.drawCircle(0, 0, 2 + Math.random() * 3);
  flake.x = Math.random() * window.innerWidth * 2 - window.innerWidth;
  flake.y = Math.random() * window.innerHeight;
  flake.xspeed = 1 + Math.random();
  flake.yspeed = 2 + Math.random() * 2;
  flake.endFill();
  flakesContainer.addChild(flake);
}

// Gradient masking 
// allow that the gradient background is only visible through the flakes
gradient.mask = flakesContainer;

// Help logo
const helpLogo = PIXI.Sprite.from('../ressources/helplogo.png');
helpLogo.x = window.innerWidth - 60;
helpLogo.y = 60;
helpLogo.anchor.set(0.5);
helpLogo.scale.set(0.08);
helpLogo.interactive = true;

// Tooltip
const tooltip = PIXI.Sprite.from("../ressources/tooltip.jpg")
tooltip.anchor.set(0.5)
tooltip.scale.set(0.3);
tooltip.y = 130;
tooltip.x = window.innerWidth - 350;
tooltip.visible = false;

helpLogo.on('mouseover', () => {
  showSprite(tooltip, 0.3);
});

helpLogo.on('mouseout', () => {
  reduceSprite(tooltip);
});

// Loading text
const loadingText = new PIXI.Text('Searching throw SPARQL database...', { ...style, fontSize: 30 });
loadingText.anchor.set(1, 0.5);
loadingText.x = window.innerWidth * 0.9 - 40;
loadingText.y = window.innerHeight * 0.9;
loadingText.visible = false;

// loading icon
const textureArray = [];

for (let i = 0; i < 41; i++) {
  const texture = PIXI.Texture.from(`../ressources/chain/frame_${i}.png`);
  textureArray.push(texture);
}

const loadingIcon = new PIXI.AnimatedSprite(textureArray);
loadingIcon.scale.set(0.2);
loadingIcon.anchor.set(0.5);
loadingIcon.animationSpeed = 0.5;
loadingIcon.visible = false;

// question searched by the user
const questionText = new PIXI.Text('', { ...style, fontSize: 40 });
questionText.anchor.set(0.5);
questionText.x = window.innerWidth / 2;
questionText.y = -window.innerHeight / 2;

// query searched by the user
const queryText = new PIXI.Text('', { ...style, align: 'left', fontSize: 40 });
queryText.anchor.set(0.5);
queryText.x = window.innerWidth / 2;
queryText.y = window.innerHeight * 1.5;


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


// User input
const userInput = new PIXI.Text('', { ...style });

// Input background
const inputBackground = PIXI.Sprite.from(PIXI.Texture.WHITE);
inputBackground.tint = "#222222";
inputBackground.anchor.set(0.5);
inputBackground.width = 600;
inputBackground.height = 100;
inputBackground.filters = [new PIXI.BlurFilter(60)];

// Cursor
const cursor = PIXI.Sprite.from(PIXI.Texture.WHITE);
cursor.tint = "#FFFFFF";
cursor.anchor.set(0.5);
cursor.width = 10;
cursor.height = style.fontSize;


// Add sprites to stage
app.stage.addChild(
  gradient,
  flakesContainer,
  inputBackground,
  cursor,
  helpLogo,
  tooltip,
  userInput,
  bottomPanel,
  topPanel,
  questionText,
  queryText,
  loadingIcon,
  loadingText
);

// Shockwave effect
const shockwaveEffect = new PIXI.filters.ShockwaveFilter([window.innerWidth / 2, window.innerHeight / 2]);
shockwaveEffect.radius = -1;
shockwaveEffect.time = -1;
shockwaveEffect.speed = 250;
shockwaveEffect.brightness = 1;
shockwaveEffect.amplitude = 80;
shockwaveEffect.wavelength = 500;

userInput.filters = [shockwaveEffect];
gradient.filters = [shockwaveEffect];

// WIP
// reflection effect on the whole page
// look sick but distracting
const reflectionFilter = new PIXI.filters.ReflectionFilter();
reflectionFilter.boundary = 0.6;
reflectionFilter.alpha = [1, 0];
// app.stage.filters = [reflectionFilter];


function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  gradient.width = window.innerWidth;
  gradient.height = window.innerHeight;
  inputBackground.x = window.innerWidth / 2;
  inputBackground.y = window.innerHeight / 2;
  cursor.x = window.innerWidth / 2;
  cursor.y = window.innerHeight / 2 - 10;
  userInput.x = window.innerWidth / 2;
  userInput.y = window.innerHeight / 2 - inputBackground.height / 2 + 10;
  loadingText.x = window.innerWidth - 175;
  loadingText.y = window.innerHeight - 60;
  loadingIcon.x = window.innerWidth - 100;
  loadingIcon.y = window.innerHeight - 75;
  // loadingIcon.y = window.innerHeight * 1.3;
  flakesContainer.children.forEach(flake => {
    flake.x = Math.random() * window.innerWidth * 2 - window.innerWidth;
    flake.y = Math.random() * window.innerHeight;
  })
  questionText.x = window.innerWidth / 2;
  queryText.x = window.innerWidth / 2;
  tooltip.x = window.innerWidth - 350;
  helpLogo.x = window.innerWidth - 60;
  bottomPanel.width = window.innerWidth;
  bottomPanel.height = window.innerHeight;
  userInput.style.wordWrapWidth = window.innerWidth * 0.9;
  questionText.style.wordWrapWidth = window.innerWidth * 0.9;
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

function showSprite(sprite, scale) {
  const ticker = PIXI.Ticker.shared;
  sprite.scale.set(0.1);
  sprite.visible = true;

  const onTick = (deltaTime) => {
    sprite.scale.x *= 1.1;
    sprite.scale.y *= 1.1;
    if (sprite.scale.x >= scale) {
      sprite.scale.set(scale);
      ticker.remove(onTick);
    }
  }

  ticker.add(onTick);
}

function reduceSprite(sprite) {
  const ticker = PIXI.Ticker.shared;

  const onTick = (deltaTime) => {
    sprite.scale.x *= 0.8;
    sprite.scale.y *= 0.8;
    if (sprite.scale.x <= 0.005) {
      sprite.visible = false;
      ticker.remove(onTick);
    }
  }

  ticker.add(onTick);
}

function closePanels() {
  const ticker = PIXI.Ticker.shared;
  const target = window.innerHeight;
  questionText.text = inputText;

  const onTick = (deltaTime) => {
    // resultPanel.y += 0.5;
    bottomPanel.y += (0 - bottomPanel.y) * 0.02;
    topPanel.y += (target - topPanel.y) * 0.02;
    // loadingIcon.y += (window.innerHeight / 2 - loadingIcon.y) * 0.01;
    questionText.y += (window.innerHeight * 0.1 - questionText.y) * 0.04;
    queryText.y += (window.innerHeight / 2 - queryText.y) * 0.02;
    if (queryText.y < window.innerHeight / 2 + 50) {
      ticker.remove(onTick);
      loadingIcon.currentFrame = 28;
      loadingIcon.play();
      showSprite(loadingIcon, 0.5);
      showSprite(loadingText, 1);
    }
  }

  ticker.add(onTick);
}

function openPanels(text) {
  const ticker = PIXI.Ticker.shared;
  const target = -window.innerHeight;
  console.log(text);
  userInput.text = text;
  reduceSprite(loadingIcon);
  reduceSprite(loadingText);
  showSprite(userInput, 1);
  anwserScreen = true;


  const onTick = (deltaTime) => {
    bottomPanel.y += (window.innerHeight * 2 - bottomPanel.y) * 0.02;
    topPanel.y += (target - topPanel.y) * 0.02;
    questionText.y += (-200 - questionText.y) * 0.04;
    queryText.y += (window.innerHeight * 2 - queryText.y) * 0.02;

    if (topPanel.y < 0) {
      ticker.remove(onTick);
      console.log(userInput);
    }
  }

  ticker.add(onTick);
}

String.prototype.replaceAt = function(index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function askQuestion(question) {
  fetch('/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question: question }),
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response data
      console.log(data);
      queryText.text = data.resp;
      queryText.y = window.innerHeight + queryText.height;
      closePanels();
      getResultFromDBpedia(data.resp);
      console.log(data.resp);
      // console.log(`response from serv ${data}`);
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
    });
}

function getResultFromDBpedia(query) {
  fetch('/dbpedia', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query }),
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response data
      console.log(data.resp);
      let text = data.resp.split('\n');
      if (text.length === 1)
        text = "Sorry, dbpedia did not provide\na clear anwser to the query."
      else {
        text.shift();
        text = text.join('. ');
      }
      setTimeout(() => openPanels(text), 4000);
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
    });
}

window.addEventListener('keydown', function(event) {
  userIsWriting = true;
  repetitions = 2;
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
    askQuestion(inputText);
    // fadeIn(searchingText, 3000)
    inputBackground.visible = false;
    cursor.visible = false;
    shockWave = true;
    shockwaveEffect.time = 0;
    console.log(`user input: '${inputText}'`)
  }
  if (ctrlMode) return; // don't type if ctrl key is held
  if (key.length > 1) return; // only add alpha alpha keys to input text
  inputText += shiftMode ? key.toUpperCase() : key;
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
  "Who is the oldest human ?"
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
  if (!anwserScreen)
    userInput.text = inputText.length > 0 ? inputText : randomString;
  userInput.x = window.innerWidth / 2 - userInput.width / 2;
  cursor.x = window.innerWidth / 2 + userInput.width / 2 + 10;
  // if (inputText.slice(-1) === ' ') cursor.x += style.fontSize / 2;
  if (userInput.width + 100 > inputBackground.width) inputBackground.width = userInput.width + 100;
  else if (inputBackground.width > 600 && userInput.width + 100 < inputBackground.width) inputBackground.width -= 50;
  flakesContainer.children.forEach(flake => {
    updateFlake(flake);
  });
  if (shockwaveEffect.time > 5) {
    shockWave = false;
    shockwaveEffect.time = -1;
  }
  if (shockWave)
    shockwaveEffect.time += 0.03;
  // loadingText.text = loadingText.text.split("")
  //   .map((letter, index) => {
  //     return listOfSymbols[Math.floor(Math.random() * listOfSymbols.length)]
  //   }).join("")
  // console.log(`'${userInput.text}'`);
});


