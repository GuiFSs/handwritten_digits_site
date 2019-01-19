let drawing = [];
let currentPath = [];
let isDrawing = true;

let predictBtn;
let predictedVal;

function setup() {
  canvas = createCanvas(200, 200);
  canvas.mousePressed(startPath);
  canvas.mouseReleased(endPath);

  canvas.parent('canvas-container');

  let resetBtn = select('#reset');
  predictBtn = select('#predict');
  predictedVal = select('#predicted-val');

  resetBtn.mousePressed(resetCanvas);
  predictBtn.mousePressed(predictImage);

  background(0);
}

function draw() {
  background(0);
  if (isDrawing) {
    currentPath.push({
      x: mouseX,
      y: mouseY
    });
  }

  drawing.map(paths => {
    beginShape();
    paths.map(cords => {
      stroke(255);
      strokeWeight(10);
      noFill();
      vertex(cords.x, cords.y);
    });
    endShape();
  });
}

function startPath() {
  isDrawing = true;
  currentPath = [];
  currentPath.push({
    x: mouseX,
    y: mouseY
  });
  drawing.push(currentPath);
}

function endPath() {
  isDrawing = false;
}

function predictImage() {
  console.log('wtf');

  // classifyBtnDisabled(true);

  saveFrames('out', 'png', 1, 1, async data => {
    img = data;
    img = img[0];
    img.imageData = img.imageData.replace(
      /data:image\/octet-stream;base64,/,
      ''
    );

    const settings = {
      method: 'POST',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(img)
    };

    console.log(img);

    // const base_url = 'http://127.0.0.1:5000/';
    const response = await fetch('/predict', settings);
    const responseJson = await response.json();
    let predicted = responseJson.prediction;
    predictedVal.elt.innerText = 'predicted value: ' + predicted;

    console.log(responseJson);
    classifyBtnDisabled(false);
    resetCanvas();
  });
}

function classifyBtnDisabled(disabled) {
  predictBtn.elt.disabled = disabled;
}

function resetCanvas() {
  drawing = [];
  clear();
}
