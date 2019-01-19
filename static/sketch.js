let drawing = [];
let currentPath = [];
let isDrawing = false;

let predictBtn;
let predictedVal;

function setup() {
  canvas = createCanvas(100, 100);
  canvas.mousePressed(e => startPath(e));
  canvas.mouseReleased(endPath);

  canvas.touchMoved(touchStartPath);
  canvas.touchEnded(touchEndPath);

  canvas.canvas.addEventListener('mouseout', () => {
    isDrawing = false;
  });

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
      x: pmouseX || mouseX,
      y: pmouseY || mouseY
    });
    predictImage();
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
  return false;
}

function touchStartPath() {
  isDrawing = true;
  // currentPath = [];
  currentPath.push({
    x: mouseX,
    y: mouseY
  });
  drawing.push(currentPath);
  predictImage();
  return false;
}

function touchEndPath() {
  isDrawing = false;
  currentPath = [];
}

function endPath() {
  isDrawing = false;
}

function predictImage() {
  classifyBtnDisabled(true);

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

    try {
      const response = await fetch('/predict', settings);
      const responseJson = await response.json();
      let predicted = responseJson.prediction;
      predictedVal.elt.innerText = 'predicted value: ' + predicted;
    } catch (err) {
      return;
    }

    // console.log(responseJson);
    classifyBtnDisabled(false);
    // resetCanvas();
  });
}

function classifyBtnDisabled(disabled) {
  predictBtn.elt.disabled = disabled;
}

function resetCanvas() {
  drawing = [];
  clear();
}

// Prevent scrolling when touching the canvas
document.body.addEventListener(
  'touchstart',
  function(e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  false
);
document.body.addEventListener(
  'touchend',
  function(e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  false
);
document.body.addEventListener(
  'touchMoved',
  function(e) {
    console.log(e);

    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  false
);
