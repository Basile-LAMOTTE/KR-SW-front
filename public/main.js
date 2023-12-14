const app = new PIXI.Application({
  autoResize: true,
  resolution: devicePixelRatio,
  backgroundColor: 0x1E3266,
});

document.body.appendChild(app.view);

var inputText = "";
var ctrlMode = false;
var shiftMode = false;

// text style
const style = new PIXI.TextStyle({
  fontFamily: "Roboto",
  // fontWeight: "bold",
  align: "center",
  fontSize: 75,
  fill: "black",
});

// input box
const inputBox = PIXI.Sprite.from(PIXI.Texture.WHITE);
inputBox.tint = "#FFFFFF";
inputBox.anchor.set(0.5);
inputBox.width = 600;
inputBox.height = 100;

// cursor
const cursor = PIXI.Sprite.from(PIXI.Texture.WHITE);
cursor.tint = "#000000";
cursor.anchor.set(0.5);
cursor.width = 10;
cursor.height = 75;

// user input 
const userInput = new PIXI.Text('', { ...style });

// add sprites to stage
app.stage.addChild(inputBox);
app.stage.addChild(cursor);
app.stage.addChild(userInput);

function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  inputBox.x = window.innerWidth / 2;
  inputBox.y = window.innerHeight / 2;
  cursor.x = window.innerWidth / 2;
  cursor.y = window.innerHeight / 2;
  userInput.x = window.innerWidth / 2;
  userInput.y = window.innerHeight / 2 - inputBox.height / 2 + 10;
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
}

window.addEventListener('keydown', function(event) {
  const key = event.key;
  if (ctrlMode) {
    shortcutManager(key);
  }
  // special keys
  if (key === "Control") ctrlMode = true;
  if (key === "Shift") shiftMode = true;
  if (key === "Escape") inputText = "";
  if (key === "Backspace") inputText = inputText.slice(0, -1);
  if (ctrlMode) return; // don't type if ctrl key is held
  if (key.length > 1) return; // only type alpha keys
  inputText += shiftMode ? key.toUpperCase() : key;
});

window.addEventListener('keyup', function(event) {
  const key = event.key;
  if (key === "Control") ctrlMode = false;
  if (key === "Shift") shiftMode = false;
});

app.ticker.add((delta) => {
  userInput.text = inputText;
  userInput.x = window.innerWidth / 2 - userInput.width / 2;
  cursor.x = window.innerWidth / 2 + userInput.width / 2 + 10;
  if (userInput.width + 100 > inputBox.width) inputBox.width = userInput.width + 100;
  else if (inputBox.width > 600 && userInput.width + 100 < inputBox.width) inputBox.width -= 50;
  // if (userInput.width + 100 < inputBox.width) inputBox.width -= 600;
});


